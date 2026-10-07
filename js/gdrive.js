/* Google Drive backup/restore for Aura.
   Uses Google Identity Services (token flow) + Drive appDataFolder.
   The OAuth client ID is public by design; the access token lives only in memory. */
(function () {
  'use strict';

  var CLIENT_ID = '556499767563-2c6mhug57nqr04ahd1n6483ggi88186n.apps.googleusercontent.com';
  var SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
  var BACKUP_NAME = 'aura-backup.json';

  var accessToken = null;
  var tokenClient = null;

  function T() { return (typeof t === 'function') ? t() : {}; }

  function ensureGis(cb) {
    if (window.google && google.accounts && google.accounts.oauth2) return cb();
    var s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = cb;
    s.onerror = function () {
      var lang = T();
      toast(lang.gdriveLoadFail || 'Could not load Google sign-in', 'err');
    };
    document.head.appendChild(s);
  }

  function getTokenClient() {
    if (tokenClient) return tokenClient;
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: function (resp) {
        if (resp && resp.access_token) {
          accessToken = resp.access_token;
          if (pendingAction) {
            var act = pendingAction;
            pendingAction = null;
            act();
          }
        } else {
          var lang = T();
          toast(lang.gdriveAuthFail || 'Google sign-in failed', 'err');
          pendingAction = null;
        }
        setGdriveBusy(false);
      }
    });
    return tokenClient;
  }

  var pendingAction = null;

  // Run `fn` with a valid access token (prompts sign-in if needed).
  function withToken(fn) {
    if (accessToken) return fn();
    pendingAction = fn;
    setGdriveBusy(true);
    ensureGis(function () {
      try {
        getTokenClient().requestAccessToken({ prompt: '' });
      } catch (_) {
        pendingAction = null;
        setGdriveBusy(false);
        var lang = T();
        toast(lang.gdriveAuthFail || 'Google sign-in failed', 'err');
      }
    });
  }

  function setGdriveBusy(busy) {
    document.querySelectorAll('[data-gdrive-btn]').forEach(function (b) {
      b.disabled = !!busy;
      b.classList.toggle('busy', !!busy);
    });
  }

  function buildBackupJson() {
    return JSON.stringify({
      app: 'aura',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: (typeof state !== 'undefined') ? state.data : {},
      logs: (typeof state !== 'undefined') ? state.logs : {}
    });
  }

  function findBackupFile() {
    var q = encodeURIComponent("'appDataFolder' in parents and name='" + BACKUP_NAME + "' and trashed=false");
    return fetch('https://www.googleapis.com/drive/v3/files?q=' + q + '&spaces=appDataFolder&fields=files(id,name,modifiedTime)', {
      headers: { Authorization: 'Bearer ' + accessToken }
    }).then(function (r) {
      if (!r.ok) throw new Error('list ' + r.status);
      return r.json();
    }).then(function (j) {
      return (j.files && j.files[0]) || null;
    });
  }

  function uploadBackup(fileId) {
    var metadata = { name: BACKUP_NAME, mimeType: 'application/json' };
    if (!fileId) metadata.parents = ['appDataFolder'];
    var body = new FormData();
    body.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    body.append('file', new Blob([buildBackupJson()], { type: 'application/json' }));
    var url = fileId
      ? 'https://www.googleapis.com/upload/drive/v3/files/' + fileId + '?uploadType=multipart'
      : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    var method = fileId ? 'PATCH' : 'POST';
    return fetch(url, { method: method, headers: { Authorization: 'Bearer ' + accessToken }, body: body })
      .then(function (r) {
        if (!r.ok) throw new Error('upload ' + r.status);
        return r.json();
      });
  }

  function downloadBackup(fileId) {
    return fetch('https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media', {
      headers: { Authorization: 'Bearer ' + accessToken }
    }).then(function (r) {
      if (!r.ok) throw new Error('download ' + r.status);
      return r.text();
    });
  }

  function fmtDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (_) { return ''; }
  }

  // --- public API ---

  window.gdriveBackup = function () {
    withToken(function () {
      setGdriveBusy(true);
      var lang = T();
      findBackupFile()
        .then(function (f) { return uploadBackup(f && f.id); })
        .then(function () {
          toast(lang.gdriveBackupOk || 'Backed up to Google Drive', 'ok');
          refreshGdriveStatus();
        })
        .catch(function () { toast(lang.gdriveBackupFail || 'Backup failed', 'err'); })
        .finally(function () { setGdriveBusy(false); });
    });
  };

  window.gdriveRestore = function () {
    var lang = T();
    var doRestore = function () {
      setGdriveBusy(true);
      findBackupFile()
        .then(function (f) {
          if (!f) throw new Error('no backup');
          return downloadBackup(f.id).then(function (raw) { return { raw: raw, when: f.modifiedTime }; });
        })
        .then(function (res) {
          if (typeof importBackupData === 'function' && importBackupData(res.raw)) {
            // close wizard if we're restoring from onboarding
            if (typeof els !== 'undefined' && els.welcome && !els.welcome.classList.contains('hidden')) {
              closeModal(els.welcome);
              if (typeof renderBotHello === 'function') renderBotHello();
              if (typeof maybeShowInstallNudge === 'function') maybeShowInstallNudge();
            }
          }
        })
        .catch(function (e) {
          toast(e.message === 'no backup' ? (lang.gdriveNoBackup || 'No backup found') : (lang.gdriveRestoreFail || 'Restore failed'), 'err');
        })
        .finally(function () { setGdriveBusy(false); });
    };
    // confirm before overwriting local data (skip confirm on fresh onboarding)
    var fresh = (typeof state !== 'undefined') && !(state.data && state.data.lastDate);
    if (fresh) return withToken(doRestore);
    withToken(function () {
      if (typeof askConfirm === 'function') {
        askConfirm(lang.gdriveRestoreTitle || 'Restore?', lang.gdriveRestoreConfirm || 'Replace local data with the Google Drive backup?')
          .then(function (ok) { if (ok) doRestore(); });
      } else {
        doRestore();
      }
    });
  };

  window.gdriveSignOut = function () {
    if (accessToken && window.google && google.accounts && google.accounts.oauth2) {
      google.accounts.oauth2.revoke(accessToken, function () {});
    }
    accessToken = null;
    refreshGdriveStatus();
    var lang = T();
    toast(lang.gdriveSignedOut || 'Signed out', 'ok');
  };

  window.gdriveIsSignedIn = function () { return !!accessToken; };

  window.refreshGdriveStatus = function () {
    var lang = T();
    document.querySelectorAll('[data-gdrive-status]').forEach(function (el) {
      el.textContent = accessToken
        ? (lang.gdriveSignedIn || 'Signed in to Google')
        : (lang.gdriveSignedOut2 || 'Not signed in');
      el.classList.toggle('ok', !!accessToken);
    });
    var outBtn = document.querySelector('[data-gdrive-signout]');
    if (outBtn) outBtn.style.display = accessToken ? '' : 'none';
  };

  // expose for debugging
  window._gdrive = { withToken: withToken };
})();
