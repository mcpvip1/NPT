// Translations. Add new keys to BOTH languages.

const i18n = {
  my: {
    appSubtitle: 'သင့်ကျန်းမာရေးနှင့် ရာသီစက်ဝန်း',

    lblHeroDay: 'ရက်မြောက်',
    lblCardPeriod: 'ရာသီလာရက်',
    lblCardFertile: 'မျိုးဥထွက်ချိန်',
    lblCardOvulation: 'မျိုးဥထွက်ရက်',
    lblCardNext: 'နောက်လာမည့်ရက်',
    lblHistoryTitle: '📜 မှတ်တမ်း',
    lblHistorySubtext: 'ရက်စွဲအလိုက် မှတ်တမ်းများ',
    lblSetupTitle: '⚙️ အပြင်အဆင်',
    lblUserName: 'သင့်အမည်',
    lblLastDate: 'နောက်ဆုံးရာသီရက်',
    lblCycleLength: 'စက်ဝန်း (ရက်)',
    lblPeriodLength: 'ရာသီ (ရက်)',
    lblLutealLength: 'Luteal (ရက်)',
    lblNotifyEnable: 'ရာသီနီးပါက သတိပေးရန်',
    lblNotifyDays: 'ရက်အလိုတွင်',
    lblBotEnable: '🤖 ချစ်စရာ အကူ bot လေး ပြမယ်',
    lblRemindLog: '📝 နေ့စဉ် မှတ်တမ်းသတိပေးချက်',
    lblRemindTime: 'သတိပေးမည့်အချိန်',
    greetMorning: n => `မင်္ဂလာနံနက်ခင်းပါ${n ? ' ' + n : ''}! 🌤️`,
    greetAfternoon: n => `မင်္ဂလာနေ့လည်ခင်းပါ${n ? ' ' + n : ''}! ☀️`,
    greetEvening: n => `မင်္ဂလာညချမ်းပါ${n ? ' ' + n : ''}! 🌙`,
    greetGeneric: 'ဒီနေ့လည်း ကျန်းမာရေးကို ဂရုစိုက်ပါ 🌸',
    greetPeriodDay1: 'ဒီနေ့ စက်ဝန်းအသစ် စပါပြီ — ဖြည်းဖြည်းချင်း ဂရုစိုက်ပါ 🌸',
    greetLogNudge: 'ဒီနေ့ မှတ်တမ်း မတင်ရသေးဘူး — တစ်မိနစ်လောက် အချိန်ပေးလိုက်ပါ ✏️',
    greetTrendDown: 'နောက်ဆုံးရက်တွေမှာ စိတ်အခြေအနေ နည်းနည်းကျနေသလိုပဲ — ကိုယ့်ကိုယ်ကို ပိုဂရုစိုက်ပါ 💗',
    greetTrendUp: 'စိတ်အခြေအနေ ပြန်ကောင်းလာပြီ — ဒီအတိုင်း ဆက်သွားပါ ✨',
    moodTips: {
      great: 'အရမ်းကောင်းနေတာပဲ! ဒီစွမ်းအင်လေးနဲ့ ကိုယ်နှစ်သက်တာတွေ လုပ်လိုက်ပါ 🌟',
      good: 'ကောင်းနေတာပဲ — လမ်းလျှောက်တာ၊ သီချင်းနားထောင်တာ လုပ်ကြည့်ပါ 🙂',
      okay: 'သာမန်နေ့တစ်နေ့ပေါ့ — ရေများများသောက်ပြီး အနားယူပါ 🍵',
      low: 'စိတ်ညစ်နေရင် အသက်ကို ဖြည်းဖြည်းရှူပါ၊ နွေးနွေးထွေးထွေး နေပါ 🤗',
      bad: 'ခက်ခဲနေတယ်ဆိုတာ နားလည်ပါတယ် — ဒီနေ့ ကိုယ့်ကိုယ်ကို ညှာတာပါ 💗'
    },
    notifLogTitle: 'Aura',
    notifLogBody: 'ဒီနေ့ မှတ်တမ်း တင်ဖို့ အချိန်ရောက်ပါပြီ ✏️',
    installTitle: '📲 Home Screen မှာ ထည့်သွင်းပါ',
    installWhy: 'ဒါမှ ရာသီသတိပေးချက်နဲ့ နေ့စဉ် မှတ်တမ်းသတိပေးချက်တွေ နောက်ခံမှာ မှန်မှန်အလုပ်လုပ်မှာပါ 💗',
    installStep1: 'Browser ရဲ့ menu (⋮) ကနေ "Add to Home Screen" ကို နှိပ်ပါ',
    installStep2: 'Home Screen က icon ကနေ app ကို ဖွင့်ပါ (browser ကနေ မဟုတ်ဘူးနော်)',
    installStep3: 'မေးလာရင် သတိပေးချက် (notifications) ခွင့်ပြုပေးပါ',
    installEnableNotif: '🔔 သတိပေးချက် ဖွင့်မယ်',
    installGotIt: 'နားလည်ပြီ ✓',
    installDone: 'ပြီးပါပြီ! Home Screen က icon ကနေ ဖွင့်သုံးပါ 📲',
    navAdvice: 'အကြံဉာဏ်',
    lblNotifHeading: '🔔 သတိပေးချက်များ',
    lblBotHeading: '🤖 အကူ bot',
    btnAskNotif: 'ခွင့်ပြုချက် တောင်းမယ်',
    notifGranted: 'ခွင့်ပြုထားပါတယ် ✓',
    notifDenied: 'ပိတ်ထားပါတယ်',
    notifDefault: 'မမေးရသေးပါ',
    notifUnsupported: 'ဒီမှာ မရပါ',
    notifDeniedHint: 'ခွင့်ပြုချက် ပိတ်ထားပါတယ်။ သတိပေးချက်ရဖို့ browser settings မှာ ဒီ site အတွက် notifications ဖွင့်ပေးပါ။',
    lblWellnessNudges: '💧 ကျန်းမာရေး သတိပေးချက်များ',
    lblWellnessNudgesSub: 'ရာသီစက်ဝန်းနဲ့ လက္ခဏာတွေပေါ် မူတည်တဲ့ ညင်သာတဲ့ သတိပေးချက်များ — ရေနွေးသောက်၊ အနားယူ၊ လှုပ်ရှားမှု။',
    lblAdvicePageTitle: '🤖 Aura ကို မေးပါ',
    lblAdvicePageSub: 'သင့်မှတ်တမ်းကို ဖတ်ပြီး ပေးတဲ့ ပုဂ္ဂိုလ်ရေး အကြံပြုချက်',
    lblAdviceToday: 'ဒီနေ့အတွက် အကြံပြုချက်',
    lblAdvicePermNote: '🔔 အကြံ: သတိပေးချက် ခွင့်ပြုထားရင် ဒါတွေကို နောက်ခံမှာ သတိပေးနိုင်ပါတယ်။',
    lblAdviceWhy: 'ဘာကြောင့် သင့်နဲ့ ကိုက်ညီလဲ',
    btnRemindMe: '🔔 သတိပေးပါ',
    msgRemindOn: 'ဟုတ်ကဲ့ — ဒါနဲ့ ပတ်သက်ပြီး သတိပေးပါမယ် 💗',
    lblDoctorFlags: '🚩 ဆရာဝန်နဲ့ ပြသင့်တဲ့အခါ',
    lblAdviceDisclaimer: 'Aura က ယေဘုယျ ကျန်းမာရေး အသိပေးချက်သာ မျှဝေတာပါ — ဆေးပညာ အကြံဉာဏ် ဒါမှမဟုတ် ရောဂါရှာဖွေမှု မဟုတ်ပါ။ စိုးရိမ်စရာရှိရင် ဆရာဝန်နဲ့ ပြသပါ။',
    reasonPhase: (d, phase) => `ရက်မြောက် ${d} · ${phase}`,
    reasonSymptom: (sym, n) => `"${sym}" ကို ${n} ရက်အလိုက မှတ်ထားတယ်`,
    reasonMood: 'မကြာသေးခင်က စိတ်အခြေအနေတွေအရ',
    doctorFlags: [
      'နာရီတိုင်း pad လဲရလောက်အောင် နာရီပေါင်းများစွာ သွေးဆင်းများတာ',
      'အပူကပ်တာ၊ အနားယူတာ၊ ပုံမှန်ဆေးတွေနဲ့မှ မသက်သာတဲ့ ပြင်းထန်တဲ့ ကိုက်ခဲမှု',
      '၂၁ ရက်ထက် စောတာ၊ ၃၅ ရက်ထက် နောက်ကျတာ၊ ဒါမှမဟုတ် လအတော်ကြာ မလာတာ',
      'ရာသီမလာတဲ့ ကြားကာလမှာ သွေးဆင်းတာ',
      'ရာသီလာနေတုန်း ဖျားတာ၊ မူးတာ၊ သတိလစ်တာ',
      'ရာသီမလာချိန်မှာ တင်ပါးဆုံတွင်း နာတာ'
    ],
    phaseAdvice: {
      menstrual: {
        title: '🩸 ရာသီလာရက်များ — အနားယူပါ၊ နွေးနွေးထွေးထွေး နေပါ',
        body: 'ဒီအချိန်မှာ အပူက အကောင်းဆုံး မိတ်ဆွေပါ — ဗိုက်အောက်ပိုင်းမှာ ရေနွေးအိတ် ၁၅–၂၀ မိနစ် ကပ်တာဟာ အကိုက်အခဲပျောက်ဆေးနီးပါး ထိရောက်တယ်လို့ လေ့လာမှုတွေက ဆိုပါတယ်။ ရေနွေးနွေး မကြာခဏသောက်ပါ၊ သွေးဆင်းများရင် ပဲ၊ ဟင်းနုနွယ်၊ အသား စတဲ့ သံဓာတ်ပါတဲ့ အစားအစာတွေ စားပါ။ ၁၀–၂၀ မိနစ် ပေါ့ပေါ့ပါးပါး လမ်းလျှောက်တာက ကိုက်ခဲတာ သက်သာစေနိုင်ပါတယ်။ အကိုက်အခဲပျောက်ဆေး သောက်မယ်ဆိုရင် ကိုက်ခဲစကတည်းက စောစောသောက်တာ အထိရောက်ဆုံးပါ။ ကဖင်းနဲ့ အရက်ကို လျှော့ပါ။'
      },
      follicular: {
        title: '🌱 Follicular အဆင့် — အားပြန်ဖြည့်ပြီး လှုပ်ရှားပါ',
        body: 'အီစထရိုဂျင် တက်လာပြီ၊ အားအင်လည်း ပြန်လာပါပြီ — လေ့ကျင့်ခန်း လုပ်ဖို့ အကောင်းဆုံး အချိန်ပါ။ တစ်ပတ် ၃ ကြိမ်၊ ၄၅–၆၀ မိနစ် လေ့ကျင့်ခန်းက ရာသီနာကျင်မှုကို သိသိသာသာ လျှော့ချပေးတယ်လို့ သုတေသနတွေက ဆိုပါတယ်။ ဆုံးရှုံးသွားတဲ့ သံဓာတ်နဲ့ ပရိုတင်းကို အစားအစာနဲ့ ပြန်ဖြည့်ပါ၊ ရေများများ သောက်ပါ။'
      },
      fertile: {
        title: '🌟 မျိုးဥထွက်နိုင်တဲ့ ရက်များ — အားအင်အပြည့်ဝ',
        body: 'ခန္ဓာကိုယ်က အကောင်းဆုံး အခြေအနေမှာ ရှိပါတယ် — လေ့ကျင့်ခန်း၊ အလုပ်တွေ လုပ်ဖို့ အကောင်းဆုံးရက်တွေပါ။ အဖြူဆင်းများတာ သတိထားမိနိုင်ပါတယ်၊ ပုံမှန်ပါပဲ။ ကိုယ်ဝန်မလိုချင်ရင် ဒီရက်တွေမှာ သတိထားပါ။ ရေဓာတ်ပြည့်အောင် နေပြီး အိပ်ချိန်မှန်အောင် ဂရုစိုက်ပါ။'
      },
      ovulation: {
        title: '⭐ မျိုးဥထွက်တဲ့နေ့',
        body: 'ဗိုက်တစ်ဖက်မှာ နည်းနည်း စူးခနဲ ခံစားရတာ ပုံမှန်ပါပဲ၊ စိုးရိမ်စရာ မရှိပါ။ အားအင်ကောင်းနေတဲ့ အချိန်မို့ အသုံးချပါ။ ရေဘူး အနားမှာ ထားပြီး အစာမရှောင်ပါနဲ့ — သွေးတွင်းသကြားဓာတ် ကျတာ ဟော်မုန်းပြောင်းချိန်မှာ ပိုခံစားရပါတယ်။'
      },
      luteal: {
        title: '🌙 Luteal အဆင့် — တည်ငြိမ်အောင် ဂရုစိုက်ပါ',
        body: 'PMS အချိန်ပါ — အစားချဉ်ချင်းတပ်တာ၊ ဗိုက်ကယ်တာ၊ စိတ်ကျတာ အားလုံး ဟော်မုန်းကြောင့်ပါ။ ဆား၊ သကြား၊ ကဖင်းကို လျှော့ပါ — ဒါတွေက လက္ခဏာတွေ ပိုဆိုးစေတယ်လို့ လေ့လာမှုတွေက ဆိုပါတယ်။ အိပ်ချိန်မှန်အောင် ဂရုစိုက်ပါ၊ မနက်ပိုင်း နေရောင်ထိပါ။ အခွံမာသီး၊ ငှက်ပျောသီး၊ ချောကလက်ခါး စတဲ့ မဂ္ဂနီဆီယမ်ပါတဲ့ အစားအစာတွေ အဆင်ပြေပါတယ်။ စိတ်ဓာတ်ကျတာ ရာသီပြီးတဲ့အထိ ကြာနေရင် ယုံကြည်ရသူ ဒါမှမဟုတ် ဆရာဝန်နဲ့ တိုင်ပင်ပါ။'
      }
    },
    nudges: {
      'warm-water': {
        title: '💧 ဒီနေ့ ရေနွေးသောက်ပြီးပြီလား?',
        body: 'ရေနွေးနွေးက ကိုက်ခဲတာနဲ့ ဗိုက်ကယ်တာ သက်သာစေပါတယ်။ ရေနွေးအိုးတည်လိုက်ပါ 💗'
      },
      'heat-pad': {
        title: '🔥 ရေနွေးအိတ် ကပ်ရအောင်?',
        body: 'ဗိုက်အောက်ပိုင်းမှာ ၁၅–၂၀ မိနစ် ကပ်တာ ကိုက်ခဲတာ သက်သာစေပါတယ်။'
      },
      'iron-foods': {
        title: '🥬 သံဓာတ် ပြန်ဖြည့်ရအောင်',
        body: 'သွေးဆင်းများရင် သံဓာတ်ကုန်ပါတယ်။ ဒီနေ့ ပဲ၊ ဟင်းနုနွယ်၊ အသား ဒါမှမဟုတ် ကြက်ဥ စားပါ။'
      },
      'gentle-move': {
        title: '🚶 ၁၀ မိနစ် လမ်းလျှောက်ရအောင်?',
        body: 'ပေါ့ပေါ့ပါးပါး လမ်းလျှောက်တာ သွေးလည်ပတ်မှုကောင်းပြီး ဗိုက်ကယ်တာ သက်သာစေပါတယ်။'
      },
      'sleep-well': {
        title: '😴 ဒီည စောစောအနားယူပါ',
        body: 'အိပ်ရေးမဝရင် နာကျင်မှု ပိုခံစားရပါတယ်။ အိပ်ချိန်မှန်၊ မီးမှိန်၊ ဖုန်းဝေး။'
      },
      'hydrate': {
        title: '💧 အရင် ရေသောက်',
        body: 'ခေါင်းကိုက်နေလား? အရင်ဆုံး ရေတစ်ခွက် အပြည့်သောက်ကြည့်ပါ။'
      }
    },
    lblDataHeading: '💾 ဒေတာ',
    btnSave: 'သိမ်းမည်',

    lblWelcomeName: 'သင့်အမည်',
    lblWelcomeLastDate: 'နောက်ဆုံးရာသီရက်',
    lblWelcomeCycle: 'စက်ဝန်း (ရက်)',
    lblWelcomePeriod: 'ရာသီ (ရက်)',
    btnWelcomeStart: 'စတင်မည် ✨',

    lblModalFlowHead: '🩸 သွေးဆင်းပမာဏ',
    lblModalSymptomsHead: '✨ ခံစားချက်',
    lblModalMoodHead: '😊 စိတ်အခြေအနေ',
    lblModalNotes: '📝 မှတ်စု',
    lblAdviceHeading: '💡 ကျန်းမာရေး အကြံပြုချက်',

    lblInsightsTitle: '📊 ခွဲခြမ်း',
    lblInsightCycle: 'စက်ဝန်း ခြုံငုံ',
    lblStatCycleDay: 'လက်ရှိရက်',
    lblStatCycleLen: 'စက်ဝန်း',
    lblStatPeriodLen: 'ရာသီ',
    lblStatDaysLeft: 'နောက်ရာသီအထိ',
    lblInsightPredictions: 'နောက်လာမည့် ၃ ကြိမ်',
    lblInsightSymptoms: 'လက္ခဏာ အကြိမ်ရေ',
    lblInsightFlow: 'သွေးဆင်းပမာဏ',
    lblInsightMood: '😊 စိတ်အခြေအနေ',
    lblInsightTotals: 'မှတ်တမ်း',
    lblStatTotalLogs: 'စုစုပေါင်း',
    lblStatMonthLogs: 'ယခုလ',

    navHome: 'ပင်မ',
    navInsights: 'ခွဲခြမ်း',
    navHistory: 'မှတ်တမ်း',
    navSettings: 'ပြင်ဆင်',

    legPeriod: 'ရာသီ',
    legFertile: 'မျိုးဥနိုင်',
    legOvulation: 'မျိုးဥထွက်',
    legNext: 'လာမည့်ရက်',

    phaseMenstrual: 'ရာသီလာချိန်',
    phaseFollicular: 'ဖောလီကူလာ',
    phaseFertile: 'မျိုးဥထွက်နိုင်ချိန်',
    phaseOvulation: 'မျိုးဥထွက်ရက်',
    phaseLuteal: 'လူတီရယ်',

    daysUnit: 'ရက်',
    todayLabel: 'ယနေ့',
    peak: 'အမြင့်ဆုံး',
    noData: 'ဒေတာ မရှိပါ',
    noLogs: 'မှတ်တမ်း မရှိသေးပါ',
    searchPlaceholder: 'ရှာဖွေရန်...',
    allMonths: 'အားလုံး',
    confirm: 'အတည်ပြု',
    cancel: 'မလုပ်တော့',
    confirmResetTitle: 'ဒေတာဖျက်မည်',
    confirmResetMsg: 'မှတ်တမ်းများ အားလုံး ပျက်မည်။',
    confirmDeleteTitle: 'မှတ်တမ်းဖျက်မည်',
    confirmDeleteMsg: 'ဤရက်စွဲ၏ မှတ်တမ်းကို ဖျက်မည်လား?',
    importTitle: 'ဒေတာထည့်ရန်',
    importHint: 'Export လုပ်ထားသော JSON ကို Paste လုပ်ပါ။',
    msgSaved: 'သိမ်းပြီးပါပြီ',
    msgSaveError: 'သိမ်းဆည်း၍ မရပါ',
    msgDeleted: 'ဖျက်ပြီးပါပြီ',
    msgImported: 'ထည့်သွင်းပြီးပါပြီ',
    msgImportError: 'ဒေတာ ဖတ်မရပါ',
    msgExported: 'ထုတ်ယူပြီးပါပြီ',
    msgCycleStart: '🌸 ရာသီစက်ဝန်း အသစ် စတင်ပါပြီ',
    alarmTitle: 'Aura',
    alarmText: d => `နောက်ရာသီရက် ${d} ရက်သာ လိုပါတော့သည်။`,
    daysLeft: d => d <= 0 ? 'ယနေ့' : `${d} ရက်ကျန်`,
    predDays: d => d <= 0 ? 'ယနေ့' : `${d} ရက်`,

    flows: {
      spotting: '📍 စွန်းရုံ', light: '💧 နည်း',
      medium: '💧💧 အသင့်အတင့်', heavy: '💧💧💧 များ'
    },
    chips: {
      cramps: '⚡ ကိုက်ခဲ', bloating: '🎈 ဗိုက်ကယ်', tired: '😴 နွမ်း',
      happy: '😊 ပျော်', moody: '😭 စိတ်ဆိုး', cravings: '🍕 အစားကြိုက်',
      headache: '💆 ခေါင်းကိုက်', acne: '🌶 ဝက်ခြံ',
      backpain: '🦴 ခါးနာ', nausea: '🤢 ပျို့'
    },
    moods: {
      great: '😄 အရမ်းကောင်း', good: '🙂 ကောင်း', okay: '😐 သာမန်',
      low: '😔 စိတ်ဓာတ်ကျ', bad: '😣 မကောင်း'
    },
    advices: {
      cramps: 'ဗိုက်ပေါ်တွင် ရေနွေးအိတ် ကပ်ပါ၊ ရေနွေးနွေး သောက်ပါ။',
      bloating: 'ဆားလျှော့စားပါ၊ ရေများများ သောက်ပါ။',
      tired: 'အနားယူပါ၊ သံဓာတ်ပါသော အစားအစာ စားပါ။',
      happy: 'စိတ်ကြည်လင်နေသောအချိန် — လေ့ကျင့်ခန်း လုပ်ပါ။',
      moody: 'ကဖင်း လျှော့ပါ၊ အသက်ရှူလေ့ကျင့်ခန်း လုပ်ပါ။',
      cravings: 'အသီးအနှံ သို့မဟုတ် အခွံမာသီး စားပါ။',
      headache: 'ရေဓာတ်ဖြည့်ပါ၊ အလင်းမှိန်တွင် အနားယူပါ။',
      acne: 'မျက်နှာ သန့်ရှင်းစွာထားပါ၊ အဆီ လျှော့ပါ။',
      backpain: 'အပူကပ်ပါ၊ ပေါ့ပါးသော လေ့ကျင့်ခန်း လုပ်ပါ။',
      nausea: 'အစာနည်းနည်း မကြာခဏ စားပါ။'
    },

    weekdays: ['တနင်္ဂနွေ', 'တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး', 'ကြာသပတေး', 'သောကြာ', 'စနေ'],
    months: ['ဇန်', 'ဖေ', 'မတ်', 'ဧပြီ', 'မေ', 'ဇွန်', 'ဇူ', 'ဩ', 'စက်', 'အောက်', 'နို', 'ဒီ']
  },

  en: {
    appSubtitle: 'Cycle Tracker',

    lblHeroDay: 'Day of Cycle',
    lblCardPeriod: 'Period',
    lblCardFertile: 'Fertile',
    lblCardOvulation: 'Ovulation',
    lblCardNext: 'Next Period',
    lblHistoryTitle: '📜 History',
    lblHistorySubtext: 'Detailed daily logs',
    lblSetupTitle: '⚙️ Settings',
    lblUserName: 'Your Name',
    lblLastDate: 'Last Period Date',
    lblCycleLength: 'Cycle (days)',
    lblPeriodLength: 'Period (days)',
    lblLutealLength: 'Luteal (days)',
    lblNotifyEnable: 'Notify when period is near',
    lblNotifyDays: 'Days in advance',
    lblBotEnable: '🤖 Show cute helper bot',
    lblRemindLog: '📝 Daily log reminder',
    lblRemindTime: 'Reminder time',
    greetMorning: n => `Good morning${n ? ', ' + n : ''}! 🌤️`,
    greetAfternoon: n => `Good afternoon${n ? ', ' + n : ''}! ☀️`,
    greetEvening: n => `Good evening${n ? ', ' + n : ''}! 🌙`,
    greetGeneric: 'Take good care of yourself today 🌸',
    greetPeriodDay1: 'A new cycle begins today — take it slow and be gentle with yourself 🌸',
    greetLogNudge: "You haven't logged today yet — it only takes a minute ✏️",
    greetTrendDown: 'Your mood has been dipping the last few days — be extra kind to yourself 💗',
    greetTrendUp: 'Your mood is trending up — keep doing what works ✨',
    moodTips: {
      great: 'Loving this energy! Channel it into something you enjoy 🌟',
      good: 'Nice and steady — a walk or your favorite playlist sounds perfect 🙂',
      okay: 'An okay day is still a good day — hydrate and rest 🍵',
      low: 'Feeling low? Slow deep breaths and something warm can help 🤗',
      bad: 'Tough days happen — go easy on yourself today 💗'
    },
    notifLogTitle: 'Aura',
    notifLogBody: "It's time to log today ✏️",
    installTitle: '📲 Install to Home Screen',
    installWhy: 'This is how period and daily log reminders keep working in the background 💗',
    installStep1: 'Tap your browser menu (⋮) → "Add to Home Screen"',
    installStep2: 'Open the app from your home screen icon (not the browser)',
    installStep3: 'Allow notifications when asked',
    installEnableNotif: '🔔 Enable notifications',
    installGotIt: 'Got it ✓',
    installDone: 'All set! Open it from your home screen 📲',
    navAdvice: 'Advice',
    lblNotifHeading: '🔔 Notifications',
    lblBotHeading: '🤖 Helper bot',
    btnAskNotif: 'Ask permission',
    notifGranted: 'Allowed ✓',
    notifDenied: 'Blocked',
    notifDefault: 'Not asked yet',
    notifUnsupported: 'Not supported here',
    notifDeniedHint: 'Permission was blocked. Enable notifications for this site in your browser settings to get reminders.',
    lblWellnessNudges: '💧 Wellness nudges',
    lblWellnessNudgesSub: 'Gentle contextual reminders — warm water, rest, movement — based on your cycle and symptoms.',
    lblAdvicePageTitle: '🤖 Ask Aura',
    lblAdvicePageSub: 'Personal guidance, read from your own history',
    lblAdviceToday: "Today's guidance",
    lblAdvicePermNote: '🔔 Tip: allow notifications and I can nudge you about these in the background.',
    lblAdviceWhy: 'Why this fits you',
    btnRemindMe: '🔔 Remind me',
    msgRemindOn: "On it — I'll nudge you about this 💗",
    lblDoctorFlags: '🚩 When to see a doctor',
    lblAdviceDisclaimer: 'Aura shares general wellness information, not medical advice or diagnosis. If anything worries you, please see a clinician — that is always the right call.',
    reasonPhase: (d, phase) => `Day ${d} · ${phase}`,
    reasonSymptom: (sym, n) => `"${sym}" logged ${n} day${n === 1 ? '' : 's'} ago`,
    reasonMood: 'From your recent moods',
    doctorFlags: [
      'Soaking through a pad or tampon every hour for several hours in a row',
      'Severe cramps that do not ease with heat, rest, or your usual pain relief',
      'Periods coming more often than every 21 days, less often than every 35 days, or stopping for months',
      'Bleeding between periods',
      'Fever, dizziness, or fainting with your period',
      'Pelvic pain outside your period'
    ],
    phaseAdvice: {
      menstrual: {
        title: '🩸 Period days — rest, warmth, iron',
        body: 'Heat is your best friend right now — studies found a heating pad on the lower belly for 15–20 minutes works about as well as ibuprofen for cramps. Sip warm fluids through the day, and favor iron-rich foods (lentils, spinach, meat, eggs) if your flow is heavy. A gentle 10–20 minute walk can ease cramping, but rest whenever your body asks. If you use painkillers, they work best taken early, at the first sign of cramps. Go easy on caffeine and alcohol.'
      },
      follicular: {
        title: '🌱 Follicular phase — rebuild and move',
        body: 'Estrogen is rising and energy usually follows — the best window for stronger workouts. Research links 45–60 minutes of exercise, 3+ times a week, with noticeably less period pain over time. Replenish what your period took: protein and iron-rich meals, plenty of water.'
      },
      fertile: {
        title: '🌟 Fertile window — peak energy',
        body: "You're likely at your physical peak — great days for exercise and getting things done. You may notice more cervical fluid; that's normal. If pregnancy is not planned, this is the window to be careful. Stay hydrated and keep sleep regular as hormones shift."
      },
      ovulation: {
        title: '⭐ Ovulation day',
        body: 'A mild one-sided twinge today (mittelschmerz) is common and harmless. Energy is high — use it. Keep water nearby and don\'t skip meals; blood sugar dips hit harder around hormonal shifts.'
      },
      luteal: {
        title: '🌙 Luteal phase — steady and soothe',
        body: 'PMS territory: cravings, bloating, mood dips are hormonal, not personal failings. Cut back on salt, sugar, and caffeine — studies tie them to worse symptoms. Prioritize sleep (same bedtime helps more than you\'d think), get morning daylight, and keep movement gentle. Magnesium-rich foods (nuts, bananas, dark chocolate) are a sensible comfort. If low mood lingers beyond your period, talk to someone you trust — or a clinician.'
      }
    },
    nudges: {
      'warm-water': {
        title: '💧 Did you drink warm water today?',
        body: 'Warm fluids can ease cramps and bloating. Put the kettle on — your belly will thank you.'
      },
      'heat-pad': {
        title: '🔥 Heating pad time?',
        body: '15–20 minutes on your lower belly works about as well as ibuprofen for cramps, per studies.'
      },
      'iron-foods': {
        title: '🥬 Iron check',
        body: 'Heavy flow drains iron. Lentils, spinach, red meat, or eggs today will help you bounce back.'
      },
      'gentle-move': {
        title: '🚶 10-minute walk?',
        body: 'Gentle movement gets blood flowing and can ease bloating and cramps. No marathon needed.'
      },
      'sleep-well': {
        title: '😴 Wind down early tonight',
        body: "Poor sleep turns up pain sensitivity. Same bedtime, dim lights, phone away."
      },
      'hydrate': {
        title: '💧 Water first',
        body: 'Headache knocking? Drink a full glass of water before anything else.'
      }
    },
    lblDataHeading: '💾 Data',
    btnSave: 'Save',

    lblWelcomeName: 'Your Name',
    lblWelcomeLastDate: 'Last Period Date',
    lblWelcomeCycle: 'Cycle (days)',
    lblWelcomePeriod: 'Period (days)',
    btnWelcomeStart: 'Get Started ✨',

    lblModalFlowHead: '🩸 Flow Rate',
    lblModalSymptomsHead: '✨ Symptoms',
    lblModalMoodHead: '😊 Mood',
    lblModalNotes: '📝 Notes',
    lblAdviceHeading: '💡 Health Tips',

    lblInsightsTitle: '📊 Insights',
    lblInsightCycle: 'Cycle Overview',
    lblStatCycleDay: 'Current Day',
    lblStatCycleLen: 'Cycle Length',
    lblStatPeriodLen: 'Period Length',
    lblStatDaysLeft: 'Until Next',
    lblInsightPredictions: 'Next 3 Periods',
    lblInsightSymptoms: 'Symptom Frequency',
    lblInsightFlow: 'Flow Distribution',
    lblInsightMood: '😊 Mood',
    lblInsightTotals: 'Log Summary',
    lblStatTotalLogs: 'Total Logs',
    lblStatMonthLogs: 'This Month',

    navHome: 'Home',
    navInsights: 'Insights',
    navHistory: 'Log',
    navSettings: 'Settings',

    legPeriod: 'Period',
    legFertile: 'Fertile',
    legOvulation: 'Ovulation',
    legNext: 'Expected',

    phaseMenstrual: 'Menstrual Phase',
    phaseFollicular: 'Follicular Phase',
    phaseFertile: 'Fertile Window',
    phaseOvulation: 'Ovulation Day',
    phaseLuteal: 'Luteal Phase',

    daysUnit: 'days',
    todayLabel: 'Today',
    peak: 'Peak',
    noData: 'No data yet',
    noLogs: 'No logs yet. Tap a date to add one.',
    searchPlaceholder: 'Search...',
    allMonths: 'All months',
    confirm: 'Confirm',
    cancel: 'Cancel',
    confirmResetTitle: 'Reset All Data',
    confirmResetMsg: 'All logs and settings will be erased.',
    confirmDeleteTitle: 'Delete Log',
    confirmDeleteMsg: 'Delete this day\'s log?',
    importTitle: 'Import Data',
    importHint: 'Paste your exported JSON.',
    msgSaved: 'Saved',
    msgSaveError: 'Could not save',
    msgDeleted: 'Deleted',
    msgImported: 'Imported',
    msgImportError: 'Could not parse that JSON',
    msgExported: 'Exported',
    msgCycleStart: '🌸 A new cycle begins',
    alarmTitle: 'Aura',
    alarmText: d => `Next period in ${d} day${d === 1 ? '' : 's'}.`,
    daysLeft: d => d <= 0 ? 'Today' : `${d} day${d === 1 ? '' : 's'} left`,
    predDays: d => d <= 0 ? 'Today' : `${d} day${d === 1 ? '' : 's'}`,

    flows: {
      spotting: '📍 Spotting', light: '💧 Light',
      medium: '💧💧 Medium', heavy: '💧💧💧 Heavy'
    },
    chips: {
      cramps: '⚡ Cramps', bloating: '🎈 Bloating', tired: '😴 Tired',
      happy: '😊 Happy', moody: '😭 Moody', cravings: '🍕 Cravings',
      headache: '💆 Headache', acne: '🌶 Acne',
      backpain: '🦴 Back Pain', nausea: '🤢 Nausea'
    },
    moods: {
      great: '😄 Great', good: '🙂 Good', okay: '😐 Okay',
      low: '😔 Low', bad: '😣 Bad'
    },
    advices: {
      cramps: 'Apply a heating pad and stay warm.',
      bloating: 'Reduce sodium and drink plenty of water.',
      tired: 'Rest more and eat iron-rich foods.',
      happy: 'Great energy! Enjoy light exercise.',
      moody: 'Limit caffeine and try deep breathing.',
      cravings: 'Snack on fruit or nuts instead.',
      headache: 'Hydrate and rest in a dim room.',
      acne: 'Keep skin clean, reduce oily foods.',
      backpain: 'Use a heat pad and gentle stretching.',
      nausea: 'Eat small frequent meals, stay hydrated.'
    },

    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
};

function t() { return i18n[state.lang]; }
function locale() { return state.lang === 'my' ? 'my-MM' : 'en-US'; }
function fmtShort(d) { return d.toLocaleDateString(locale(), { month: 'short', day: 'numeric' }); }