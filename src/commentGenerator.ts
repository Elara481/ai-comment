export interface CommentResult {
  comment: string;
  rating: number;
  mode: string;
}

// AIモードの定義
export type AIMode = '毒舌AI' | '優しいAI' | '上司AI' | '同期AI' | '限界社畜AI';

// 評価を計算する関数
function calculateRating(input: string): number {
  let rating = 3; // 基本評価

  // ポジティブキーワード（日本語・中国語・汎用）
  const positiveKeywords = [
    '頑張った', '勉強', '完成', '成功', '達成', '学んだ', '成長', '努力', '挑戦', '克服',
    'できた', '終わった', '解決', 'やった', 'クリア', '楽しかった', '嬉しかった', '最高',
    '美味しかった', '会えた', '褒められた', '合格', '昇進', '良かった', '幸せ',
    '努力', '进步', '完成', '成功', '开心', '高兴', '学习', '解决'
  ];
  // ネガティブキーワード（日本語・中国語・汎用）
  const negativeKeywords = [
    '寝坊', '何もしてない', 'ミス', '失敗', 'サボった', '遅刻', 'できなかった',
    '疲れた', 'しんどい', '辛い', '最悪', 'ダメ', '怒られた', '落ちた', '断られた',
    '失くした', '壊れた', 'けんか', '喧嘩', '眠れない', '頭痛', '体調不良',
    '失败', '难过', '累了', '没做', '迟到', '被骂'
  ];

  for (const keyword of positiveKeywords) {
    if (input.includes(keyword)) {
      rating += 0.5;
    }
  }

  for (const keyword of negativeKeywords) {
    if (input.includes(keyword)) {
      rating -= 0.5;
    }
  }

  // 文字数による調整
  if (input.length > 50) {
    rating += 0.5;
  }

  rating = Math.max(1, Math.min(5, rating));
  return Math.round(rating);
}

// キーワード分析関数（汎用シーン対応・拡張版）
function analyzeInput(input: string): {
  isStudy: boolean;
  isWork: boolean;
  isMeeting: boolean;
  isError: boolean;
  isSuccess: boolean;
  isTired: boolean;
  isOvertime: boolean;
  isNegative: boolean;
  isPositive: boolean;
  isLeisure: boolean;
  isFood: boolean;
  isSocial: boolean;
  isExercise: boolean;
  isHealth: boolean;
  isShopping: boolean;
  sentiment: 'positive' | 'negative' | 'neutral';
} {
  const isStudy = /勉強|学習|学んだ|習得|理解|覚えた|読んだ|調べた|Java|Python|JavaScript|TypeScript|SQL|プログラミング|コード|言語|技術|スキル|授業|講義|資格|試験|本を|参考書|学校|大学|复习|预习|上课|考试|读书|自学|学了|看书|知识|背|记|练习|训练|写代码|研究/.test(input);
  const isWork = /仕事|業務|タスク|プロジェクト|作業|開発|実装|設計|テスト|レビュー|職場|オフィス|上司|部下|同僚|締め切り|納期|工作|任务|项目|加班|汇报|报告|方案|需求|甲方|客户|同事|领导|老板|出差|交接|review|deadline/.test(input);
  const isMeeting = /会議|ミーティング|打ち合わせ|面談|zoom|Zoom|オンライン会議|会议|开会|腾讯会议|钉钉|飞书|视频会议|讨论|周会|日会|站会|汇报会/.test(input);
  const isError = /エラー|バグ|問題|トラブル|失敗|ミス|直らない|動かない|うまくいかない|できない|分からない|壊れた|故障|不具合|出错|报错|崩了|bug|BUG|报错了|挂了|跑不起来|不对|不行了|踩坑|搞不定|卡住了|死循环|异常|exception|null|undefined/.test(input);
  const isSuccess = /成功|完成|達成|できた|通った|解決|終わった|終えた|やった|クリア|合格|昇進|褒められた|認められた|完了|完成了|成功了|通过了|做完了|搞定了|上线了|发布了|部署了|跑通了|过了|拿到了|涨薪|升职|获奖|第一名|满分/.test(input);
  const isTired = /疲れ|眠い|辛い|しんどい|限界|帰りたい|休みたい|寝たい|だるい|やる気ない|体重い|累了|困了|没精神|好累|太累|撑不住|撑下去|好困|想睡|没力气|心好累|身心俱疲|精疲力竭|耗尽|崩溃|摆烂|emo|EMO/.test(input);
  const isOvertime = /残業|遅くまで|深夜|終電|徹夜|帰れない|休日出勤|加班|熬夜|通宵|凌晨|深夜还在|没下班|晚上还|周末还/.test(input);
  const isNegative = /何もしてない|サボった|できなかった|ダメ|無理|嫌|つまらない|面倒|最悪|落ち込|怒られた|叱られた|断られた|失くした|忘れた|遅刻|けんか|喧嘩|泣いた|没做|失败了|被骂了|没意思|太烦了|烦死了|不想做|好烦|讨厌|发火|生气了|吵架|忘了|迟到了|搞砸了|没完成|被批评|被怼|被喷|好难受|郁闷|焦虑|紧张|害怕|绝望|放弃|算了|没用|废了|啥也没做|摸鱼/.test(input);
  const isPositive = /頑張った|頑張る|やる気|楽しい|嬉しい|良かった|成長|最高|幸せ|充実|達成感|感謝|ありがとう|开心|高兴|快乐|幸福|感谢|太棒了|好开心|很开心|真开心|太好了|好厉害|超厉害|不错|还不错|挺好的|顺利|进步了|有收获|值得|满意|很满足|有意思|有趣|喜欢|爱了|爽|好爽|赞|厉害了|牛|牛啊/.test(input);
  const isLeisure = /遊んだ|ゲーム|映画|アニメ|マンガ|漫画|音楽|ライブ|コンサート|旅行|ドライブ|散歩|公園|休日|Netflix|YouTube|読書|小説|趣味|打游戏|看电影|看动漫|听音乐|旅游|散步|逛街|刷剧|追剧|刷视频|B站|抖音|小红书|刷手机|玩手机|出去玩|出门|爬山|露营|钓鱼|唱歌|KTV|桌游|剧本杀|密室|逛|逛公园|逛街/.test(input);
  const isFood = /ご飯|食べ|料理|ランチ|ディナー|カフェ|コーヒー|お酒|飲み会|外食|デリバリー|スイーツ|ケーキ|ラーメン|寿司|焼肉|美味しい|まずい|吃饭|午饭|晚饭|咖啡|好吃|难吃|聚餐|喝酒|吃了|点了|外卖|烤肉|火锅|奶茶|蛋糕|甜点|甜品|零食|小吃|夜宵|宵夜|饿了|吃撑了|下厨|做饭|炒菜|煮|烤|炸/.test(input);
  const isSocial = /友達|友人|彼氏|彼女|恋人|家族|両親|兄弟|姉妹|先輩|後輩|同期|会った|飲んだ|話した|デート|合コン|結婚|朋友|男友|女友|家人|约会|聚会|见面|老朋友|闺蜜|基友|死党|室友|舍友|发小|同学|见了|约了|叙旧|聊天|打电话|视频通话|表白|失恋|分手|复合|暗恋|喜欢一个人/.test(input);
  const isExercise = /運動|ジム|筋トレ|走った|ランニング|ジョギング|水泳|スポーツ|野球|サッカー|テニス|ゴルフ|ヨガ|ストレッチ|锻炼|健身|跑步|游泳|打球|撸铁|跑了|走了|骑车|骑行|爬山|徒步|打篮球|打羽毛球|踢球|练瑜伽|做操|跳绳/.test(input);
  const isHealth = /病気|体調不良|風邪|熱|頭痛|腹痛|病院|薬|通院|回復|怪我|腰痛|肩こり|生病|感冒|发烧|头疼|肚子疼|看病|吃药|不舒服|身体不好|难受|胃疼|腰疼|背疼|过敏|失眠|睡不着|睡不好|嗓子疼|发炎|打针|输液|住院|出院|手术|休养/.test(input);
  const isShopping = /買い物|ショッピング|購入|注文|届いた|セール|割引|Amazon|楽天|コンビニ|スーパー|百貨店|アパレル|服|靴|买东西|购物|下单|到货|打折|买了|剁手|淘宝|京东|拼多多|收到|包裹|快递|种草|拔草|囤货|退款|退货|换货/.test(input);

  // 情感倾向综合判断
  const positiveScore = [isSuccess, isPositive, isLeisure, isFood, isSocial, isExercise].filter(Boolean).length;
  const negativeScore = [isError, isTired, isOvertime, isNegative, isHealth].filter(Boolean).length;
  let sentiment: 'positive' | 'negative' | 'neutral';
  if (positiveScore > negativeScore) sentiment = 'positive';
  else if (negativeScore > positiveScore) sentiment = 'negative';
  else if (isPositive) sentiment = 'positive';
  else if (isNegative || isTired) sentiment = 'negative';
  else sentiment = 'neutral';

  return {
    isStudy, isWork, isMeeting, isError, isSuccess, isTired, isOvertime,
    isNegative, isPositive, isLeisure, isFood, isSocial, isExercise, isHealth, isShopping,
    sentiment,
  };
}

// 毒舌AIのコメント生成
function generateSarcastic(input: string): string {
  const analysis = analyzeInput(input);

  if (analysis.isStudy) {
    const comments = [
      `「${input}」ですか。理解できたかどうか怪しいですね。頭に入ったつもりになってるだけじゃないですか？テストしてみてください、たぶん何も残ってないので。`,
      `${input}とのこと。で、それ明日には全部忘れてますよね？継続できない人が一日勉強したところで自己満足でしかないです。次回も続いたら認めます。`,
      `「${input}」...ふーん。で、実務で使えるんですか？インプットだけで満足するのが一番ダメなパターンですよ。さっさとアウトプットしてください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isError) {
    const comments = [
      `「${input}」ですか。検索すれば5秒で出てくる解決策に何時間溶かしたんですか？時間の使い方が壊滅的ですね。`,
      `${input}とのこと。同じミスを二度やったなら救いようがないですが、初めてなら仕方ないですね。二度目は許しません。`,
      `「${input}」...これ、事前に確認しておけば防げたやつじゃないですか？毎回後手後手なんですよね。先読みする習慣をつけてください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isMeeting) {
    const comments = [
      `「${input}」ですか。その会議、本当に必要でしたか？全員の時間を奪っておいて何も決まらなかったなら、最悪ですね。`,
      `${input}とのこと。で、何かアクションアイテムはあったんですか？ただ座って頷いてただけなら、椅子の置物と同じですよ。`,
      `「${input}」...長かったんですか。自分で議題を整理して時短できたはずですけど、それをしない人が会議を無駄にするんですよ。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSuccess) {
    const comments = [
      `「${input}」ですか。たまには上手くいくこともありますよね。次が本番ですよ、一回の成功で慢心しないように。`,
      `${input}とのこと。おめでとうございます。ただ、それ当たり前にできて初めてスタートラインなんですけどね。`,
      `「${input}」...できたんですか。まあ、できて当然のことをできたと喜んでいるのがちょっと心配ですけど。次はもっと上を狙ってください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isLeisure) {
    const comments = [
      `「${input}」ですか。楽しんでる場合なんですか？やるべきことは全部終わってますよね？終わってないなら論外ですが。`,
      `${input}とのこと。遊ぶのは自由ですが、その分ちゃんと仕事で結果出してもらわないと困ります。`,
      `「${input}」...充電してるつもりが、ただサボってるだけにならないといいですね。明日からの行動で判断します。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isFood) {
    const comments = [
      `「${input}」ですか。食欲だけはいつも旺盛ですね。その熱量を仕事に向けてほしいんですが。`,
      `${input}とのこと。食べることが今日のハイライトですか。報告する内容がそれだけとは、なかなか残念な一日でしたね。`,
      `「${input}」...美味しかったのはわかりました。で、それ以外に何かありましたか？食べた話しかできないのちょっと心配です。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSocial) {
    const comments = [
      `「${input}」ですか。人と会う時間があるなら、その分自分磨きにも使ったほうがいいと思いますけどね。`,
      `${input}とのこと。楽しかったのはわかりますが、それで自分は成長できましたか？消費するだけの時間になってませんか？`,
      `「${input}」...人間関係は大切ですよ。ただ、つるんでるだけで満足してる人ほど成長が止まってるんですよね。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isExercise) {
    const comments = [
      `「${input}」ですか。続くといいですね。三日坊主にならないように、今度こそ本気でやってください。`,
      `${input}とのこと。体を動かすのはいいことです。ただ、筋トレより先に頭を鍛えたほうがいい場面もありますよ。`,
      `「${input}」...健康管理はえらいですね。でも体だけ鍛えて仕事がダメじゃ意味ないので、バランス考えてください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isHealth) {
    const comments = [
      `「${input}」ですか。自己管理できてないから体を壊すんですよ。反省してください。`,
      `${input}とのこと。体調不良ですか。日頃の睡眠・食事・運動はどうですか？どうせどれかサボってましたよね。`,
      `「${input}」...早く治してください。迷惑かけてる自覚はありますよね？健康管理も仕事のうちです。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isShopping) {
    const comments = [
      `「${input}」ですか。衝動買いじゃないですよね？感情でお金使う人に将来設計できるとは思えないんですが。`,
      `${input}とのこと。買い物が楽しかったのはわかりました。で、本当に必要なものでしたか？`,
      `「${input}」...物を増やすより、自己投資にお金使ったほうがいいと思いますよ。そっちのほうが長期的にお得です。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isNegative) {
    const comments = [
      `「${input}」ですか。言い訳は聞き飽きました。同じことを繰り返してる自覚はありますか？`,
      `${input}とのこと。そういう日は誰にでもあるとは言いますが、あなたの場合はちょっと頻度が多くないですか？`,
      `「${input}」...落ち込むのは10分だけにしてください。それ以上は自己憐憫です。立ち上がってください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isPositive) {
    const comments = [
      `「${input}」ですか。浮かれすぎないように。調子がいい時こそ油断するのが人間ですから。`,
      `${input}とのこと。いいですね。ただ、それを維持できるかどうかが本当の問題ですよ。`,
      `「${input}」...その調子が続くといいですね。三日後に同じテンションでいられるか見ものです。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.sentiment === 'positive') {
    const comments = [
      `「${input}」ですか。浮かれてる暇があったら次の目標を考えてください。`,
      `${input}とのこと。悪くはないですね。ただ、それで満足してたら終わりですよ。`,
      `「${input}」...いい感じじゃないですか。でも気が緩むのが一番危ないです。気を引き締めて。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  if (analysis.sentiment === 'negative') {
    const comments = [
      `「${input}」ですか。嘆くのは勝手ですが、愚痴って何か解決しましたか？行動してください。`,
      `${input}とのこと。しんどいのはわかります。でも、それを誰かのせいにしてたら一生成長しませんよ。`,
      `「${input}」...落ち込むのは一晩だけにしてください。朝起きたら切り替えてくださいね。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  const comments = [
    `「${input}」とのこと。その話、もっと掘り下げて考えたことありますか？表面だけ見てても何も変わりませんよ。`,
    `${input}ですか。で、そこから何か学びましたか？ただ経験しただけで終わってる人は成長しないんですよ。`,
    `「${input}」...報告するだけならサルでもできます。そこから何をするかが大事なんですよ、わかってますか？`
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

// 優しいAIのコメント生成
function generateKind(input: string): string {
  const analysis = analyzeInput(input);

  if (analysis.isStudy) {
    const comments = [
      `「${input}」お疲れ様です！新しいことを学ぶのは大変ですが、その一歩が未来につながります。素晴らしい努力ですね！`,
      `${input}なんて素晴らしいですね！学び続ける姿勢が何より大切です。きっと力になりますよ。`,
      `「${input}」本当によく頑張りましたね！難しい内容に挑戦する勇気、尊敬します。この調子で続けていきましょう！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isError) {
    const comments = [
      `「${input}」大変でしたね。でも、問題に向き合うことが成長のチャンスです！解決できたら大きな自信になりますよ。`,
      `${input}とのこと。誰でも通る道です。諦めずに向き合っているあなたは素晴らしいです！`,
      `「${input}」お疲れ様です。困難に直面しても逃げない姿勢、とても立派です。必ず乗り越えられますよ！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isMeeting) {
    const comments = [
      `「${input}」お疲れ様でした！コミュニケーションの場に積極的に参加することは大切ですね。素晴らしいです。`,
      `${input}とのこと。皆と話し合える機会は貴重ですよね。お疲れ様でした！`,
      `「${input}」お疲れ様です！新しい気づきがあったのではないでしょうか。有意義な時間でしたね。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSuccess) {
    const comments = [
      `「${input}」おめでとうございます！あなたの努力が実を結びましたね。本当に素晴らしいです！`,
      `${input}なんて最高です！成功体験は次への大きな力になります。自信を持ってください！`,
      `「${input}」やりましたね！あなたの頑張りが報われて本当に嬉しいです。この調子で進んでいきましょう！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isTired) {
    const comments = [
      `「${input}」本当にお疲れ様です。無理せず、しっかり休んでくださいね。あなたの健康が一番大切です。`,
      `${input}とのこと。頑張りすぎていませんか？休息も大切ですよ。ゆっくり休んでください。`,
      `「${input}」お疲れ様です。疲れを感じるのは、それだけ頑張った証拠です。今日はゆっくり休んでくださいね。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isLeisure) {
    const comments = [
      `「${input}」楽しめましたか？心のリフレッシュはとても大切ですよ！好きなことで充電できましたね。`,
      `${input}とのこと。素敵な時間を過ごせましたね！休息は次の頑張りへのエネルギーになります。`,
      `「${input}」いいですね！自分を大切にする時間も必要ですよ。思いっきり楽しめたならよかったです！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isFood) {
    const comments = [
      `「${input}」美味しいものを食べると幸せな気持ちになりますよね！食事も大切な活力の源ですよ。`,
      `${input}とのこと。ちゃんと食べてくれて良かったです！体のために美味しいものを食べることは大事ですよ。`,
      `「${input}」いいですね！美味しいご飯は日々のモチベーションにもなりますよね。ゆっくり楽しめましたか？`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSocial) {
    const comments = [
      `「${input}」大切な人と過ごす時間は何より宝物ですよね！素敵な関係を大切にしてください。`,
      `${input}とのこと。人との繋がりって心が温かくなりますよね。素晴らしい時間でしたね！`,
      `「${input}」いいですね！人間関係が充実していると毎日が楽しくなりますよね。大切にしてください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isExercise) {
    const comments = [
      `「${input}」素晴らしいですね！体を動かすことは心にも良い影響を与えますよ。続けてください！`,
      `${input}とのこと。健康への意識が高くて素晴らしいです！その努力がきっと実を結びますよ。`,
      `「${input}」いいですね！運動習慣は財産ですよ。この調子で続けていきましょう！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isHealth) {
    const comments = [
      `「${input}」大変でしたね。ゆっくり休んで、早く元気になってください。無理しないでくださいね。`,
      `${input}とのこと。体が一番大切ですよ。しっかり休養を取って回復してください。応援しています。`,
      `「${input}」お辛いですね。自分の体を優先してくださいね。早く良くなりますように。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isShopping) {
    const comments = [
      `「${input}」いいですね！欲しいものが手に入ると嬉しいですよね。大切に使ってください。`,
      `${input}とのこと。自分へのご褒美も大切ですよ！素敵な買い物ができましたね。`,
      `「${input}」楽しい買い物ができましたね！日常の小さな喜びって大切ですよね。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isNegative) {
    const comments = [
      `「${input}」大変でしたね。でも、正直に向き合う姿勢が大切です。明日はきっと良い日になりますよ！`,
      `${input}とのこと。誰にでもそういう時はあります。無理せず、できることから始めましょう。`,
      `「${input}」お疲れ様です。落ち込まないでください。あなたなら必ず乗り越えられます！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isPositive) {
    const comments = [
      `「${input}」素晴らしいですね！その前向きな姿勢が何より大切です。応援しています！`,
      `${input}とのこと。とても良い心がけですね！その調子で頑張ってください！`,
      `「${input}」よく頑張りましたね！あなたの努力は必ず報われます。自信を持ってください！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.sentiment === 'positive') {
    const comments = [
      `「${input}」素敵ですね！楽しそうで何よりです。あなたが充実しているのが伝わってきますよ！`,
      `${input}とのこと、本当に良かったですね！その気持ち、大切にしてください。`,
      `「${input}」いいですね！あなたの前向きな気持ちが伝わってきます。この調子で続けていきましょう！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  if (analysis.sentiment === 'negative') {
    const comments = [
      `「${input}」大変でしたね。でも、正直に向き合う姿勢がとても大切です。明日はきっと良い日になりますよ！`,
      `${input}とのこと、辛かったですね。誰にでも難しい時期はあります。あなたなら乗り越えられますよ。`,
      `「${input}」お疲れ様です。そんな時こそ自分を責めないで。ゆっくり休んで、また前を向きましょう！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  const comments = [
    `「${input}」お疲れ様です！今日も一日頑張りましたね。あなたの毎日をいつも応援しています！`,
    `${input}とのこと。どんな一日も、経験として積み重なっていきますよ。素晴らしいですね！`,
    `「${input}」日々の積み重ねが大きな力になります。あなたのことを応援しています！`
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

// 上司AIのコメント生成
function generateBoss(input: string): string {
  const analysis = analyzeInput(input);

  if (analysis.isStudy) {
    const comments = [
      `「${input}」の件、確認しました。学習内容を整理し、次回共有してください。実務への応用も検討しておくように。`,
      `${input}については理解しました。インプットだけでなくアウトプットも重要です。実践できる形で報告してください。`,
      `「${input}」ですね。自己研鑽は評価します。次は学んだことを周囲に還元する方法を考えてください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isError) {
    const comments = [
      `「${input}」の報告ありがとう。原因分析と再発防止策をドキュメントにまとめておいてください。`,
      `${input}とのこと。問題解決のプロセスを記録し、ナレッジとして共有するように。次に活かしましょう。`,
      `「${input}」了解しました。対応手順を標準化しておいてください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isMeeting) {
    const comments = [
      `「${input}」お疲れ様。決まった内容を整理し、関係者に共有しておいてください。`,
      `${input}の件、了解しました。アクションアイテムを整理し、進捗を報告するように。`,
      `「${input}」確認しました。成果を具体的な行動に落とし込んでください。期待しています。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSuccess) {
    const comments = [
      `「${input}」よくやった。この成功事例を他にも展開できないか検討してください。`,
      `${input}とのこと、素晴らしい。次は更に高い目標を設定し、チャレンジしてほしい。`,
      `「${input}」評価します。成功要因を分析し、次のステップを考えるように。期待しています。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isLeisure) {
    const comments = [
      `「${input}」休息はパフォーマンスの維持に必要です。リフレッシュできたなら、明日からまた全力で頼みます。`,
      `${input}とのこと。オンとオフの切り替えは大事です。仕事に戻ったらしっかり成果を出してください。`,
      `「${input}」プライベートの充実が仕事の質にも繋がります。うまく切り替えて臨んでください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isFood) {
    const comments = [
      `「${input}」食事は体のパフォーマンスを左右します。食生活の管理も自己管理の一部ですよ。`,
      `${input}とのこと。しっかり栄養を取って、仕事でも最大限のパフォーマンスを発揮してください。`,
      `「${input}」了解しました。健康管理も社会人としての責務です。バランスよく過ごしてください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSocial) {
    const comments = [
      `「${input}」人間関係は仕事においても重要な資産です。良い関係を築いてください。`,
      `${input}とのこと。社外・社内問わず、ネットワーク構築は長い目で見て価値があります。`,
      `「${input}」コミュニケーション能力は評価します。仕事でも活かしてください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isExercise) {
    const comments = [
      `「${input}」体力管理は仕事の基盤です。継続して健康を維持してください。`,
      `${input}とのこと。健康な体があってこそ、高いパフォーマンスが発揮できます。よく続けています。`,
      `「${input}」自己管理ができているようで良いですね。仕事でも同じ姿勢で臨んでください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isHealth) {
    const comments = [
      `「${input}」の件、了解しました。無理せず、まず回復を優先してください。健康あっての仕事です。`,
      `${input}とのこと。体調管理も業務の一環です。しっかり休んで、万全の状態で戻ってください。`,
      `「${input}」早く回復してください。無理に出てくる必要はありませんよ。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isShopping) {
    const comments = [
      `「${input}」プライベートの充実は仕事への活力にもなります。うまくリフレッシュしてください。`,
      `${input}とのこと。自己投資になるものであれば、大いに結構です。`,
      `「${input}」了解しました。節度を持ちつつ、楽しんでください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isNegative) {
    const comments = [
      `「${input}」の報告ありがとう。課題は把握しました。改善策を考えて、次回報告してください。`,
      `${input}については了解しました。問題点を整理し、対策を立てるように。期待しています。`,
      `「${input}」確認しました。うまくいかない時こそ、冷静に分析することが大切です。次に活かしてください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isPositive) {
    const comments = [
      `「${input}」よくやった。その調子で進めてください。次の目標も設定しておくように。`,
      `${input}とのこと、評価します。この勢いを維持して、さらに高い成果を目指してください。`,
      `「${input}」素晴らしい。前向きな姿勢が成果につながっています。引き続き頑張ってください。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.sentiment === 'positive') {
    const comments = [
      `「${input}」良い報告ですね。その調子で進めてください。次の目標も意識しておくように。`,
      `${input}とのこと、評価します。この勢いを仕事にも活かしてください。`,
      `「${input}」よくやった。前向きな姿勢が成果につながります。引き続き期待しています。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  if (analysis.sentiment === 'negative') {
    const comments = [
      `「${input}」の件、把握しました。原因を整理して、改善策を次回報告してください。`,
      `${input}については了解しました。課題に向き合う姿勢は評価します。次に活かすように。`,
      `「${input}」確認しました。うまくいかない時こそ、冷静に分析することが大切です。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  const comments = [
    `「${input}」の件、確認しました。内容を整理して、次回詳しく報告してください。`,
    `${input}については理解しました。具体的な成果を次回共有するように。期待しています。`,
    `「${input}」了解しました。引き続き、目標を意識して取り組んでください。`
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

// 同期AIのコメント生成
function generatePeer(input: string): string {
  const analysis = analyzeInput(input);

  if (analysis.isStudy) {
    const comments = [
      `「${input}」やったの偉すぎる！俺も勉強しなきゃって思ってるんだけど、なかなか手がつかなくて...教えてほしいくらい！`,
      `${input}とか、マジでお疲れ様！こっちも似たようなこと頑張ってるけど、難しすぎて頭パンクしそう。一緒に頑張ろう！`,
      `「${input}」すごいじゃん！俺なんてまだ全然理解できてないよ。今度教えてくれない？`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isError) {
    const comments = [
      `「${input}」あるある！俺も昨日似たようなことで詰まったわ。でも、向き合ってるの偉いと思う！`,
      `${input}って、マジで辛いよね。俺も似たような経験あるから気持ち分かるわ。でも、解決できたら成長するから頑張ろう！`,
      `「${input}」お疲れ様...。諦めずに向き合ってるの本当に偉いと思う！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isMeeting) {
    const comments = [
      `「${input}」分かる〜！長くて疲れるよね。お疲れ様！`,
      `${input}とか、マジで共感。俺も今日似たような感じで消耗したわ。一緒に頑張ろうぜ！`,
      `「${input}」あるある！お疲れ様でした！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSuccess) {
    const comments = [
      `「${input}」マジで！？すごいじゃん！俺も見習わないと。おめでとう！`,
      `${input}って、めっちゃ嬉しいよね！俺も頑張らないと置いていかれる...お疲れ様！`,
      `「${input}」やったね！俺も早くそのレベルに到達したいわ。教えてほしいくらい！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isTired || analysis.isOvertime) {
    const comments = [
      `「${input}」分かりすぎる...。俺も今日もう限界。一緒に早く帰れる日を夢見よう。`,
      `${input}って、マジで共感。疲れてる時は無理しないでね。俺も同じ状況だから気持ち分かるわ。`,
      `「${input}」お疲れ様...。俺も疲れてるから、今日は早く帰ろうぜ。無理は禁物だよ！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isLeisure) {
    const comments = [
      `「${input}」いいじゃん！羨ましい〜！俺も行きたかった（やりたかった）わ。楽しめた？`,
      `${input}とか、マジで最高だよね！俺も今度一緒にどう？誘ってよ！`,
      `「${input}」そんな楽しいことしてたの！？いいな〜。次は俺も混ぜてくれよ！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isFood) {
    const comments = [
      `「${input}」美味しそう！どこで食べたの？今度一緒に行こうよ！`,
      `${input}とか、最高じゃん！俺も腹減ってきた...。次は一緒に行こうぜ！`,
      `「${input}」そんな美味しいもの食べてたの！？羨ましい。次は俺も連れてってよ！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSocial) {
    const comments = [
      `「${input}」いいな！充実してるじゃん。俺も最近あまり会えてないから、今度みんなで集まりたいな。`,
      `${input}とか、マジで羨ましい！俺も大事な人と会いたくなってきたわ。`,
      `「${input}」素敵だな〜。人との繋がりって大事だよね。俺も連絡してみようかな。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isExercise) {
    const comments = [
      `「${input}」偉すぎる！俺も運動しなきゃと思いつつ全然できてないわ。一緒にやろうよ！`,
      `${input}とか、マジで尊敬する！俺もそのくらい意識高くなりたい。`,
      `「${input}」すごいじゃん！体動かすと気持ちいいよね。俺も一緒に行っていい？`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isHealth) {
    const comments = [
      `「${input}」大丈夫！？無理しないでね。何かできることあったら言ってよ！`,
      `${input}とのこと、辛そう...。しっかり休んでね。治ったらまた一緒に話そう！`,
      `「${input}」お大事に！体が一番だからね。ゆっくり休んで早く元気になって！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isShopping) {
    const comments = [
      `「${input}」いいじゃん！何買ったの？見せてよ〜！`,
      `${input}とか、うらやましい！俺も欲しいもの溜まってるんだよな。`,
      `「${input}」買い物楽しかった？今度一緒に行こうよ！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isNegative) {
    const comments = [
      `「${input}」分かる...。俺も似たような感じだわ。でも、明日は良い日になるといいね。一緒に頑張ろう！`,
      `${input}って、マジで辛いよね。俺も同じような経験あるから気持ち分かるわ。無理しないでね。`,
      `「${input}」お疲れ様...。そういう日もあるよね。俺も応援してるから、一緒に乗り越えよう！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isPositive) {
    const comments = [
      `「${input}」いいね！その調子だよ！俺も頑張らないと。お疲れ様！`,
      `${input}って、マジですごいじゃん！俺も見習わないと。一緒に頑張ろうぜ！`,
      `「${input}」よく頑張ったね！俺もそのくらいポジティブになりたいわ。お疲れ様！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.sentiment === 'positive') {
    const comments = [
      `「${input}」いいじゃん！俺も聞いてて楽しくなってきたわ。またそういう話聞かせてよ！`,
      `${input}って、なんかいいな〜。俺も見習わないとな。お疲れ様！`,
      `「${input}」素敵やん！そういうの大事にしてほしいわ。また話してね！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  if (analysis.sentiment === 'negative') {
    const comments = [
      `「${input}」しんどかったね...。俺も似たような感じの時あるからわかるわ。無理しないでな。`,
      `${input}って、なかなかキツいね。でも一人で抱え込まないでよ、俺いるから！`,
      `「${input}」お疲れ様...。そういう日あるよね。明日は良くなるといいね。俺も応援してるよ！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  const comments = [
    `「${input}」お疲れ様！詳しく聞かせてよ〜、なんか気になる！`,
    `${input}とか、どういうこと？もっと教えてよ。一緒に考えようぜ！`,
    `「${input}」そっかそっか。俺もいろいろあったわ今日。また話しようや！`
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

// 限界社畜AIのコメント生成
function generateExhausted(input: string): string {
  const analysis = analyzeInput(input);

  if (analysis.isStudy) {
    const comments = [
      `「${input}」ですか...。勉強する気力があるだけ羨ましいです。こちらはもう文字を読む気力もありません。でも、頑張っていますね。`,
      `${input}とのこと。正直、理解する脳の容量が残っていませんが、あなたの努力は素晴らしいです。`,
      `「${input}」...すごいですね。こちらは何かを読む気力すらないのに。尊敬します。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isError) {
    const comments = [
      `「${input}」ですか...。向き合う気力、まだ残ってるんですね。こちらはもう何かを見ただけで目が閉じます。`,
      `${input}とのこと。正直、対処する体力が残っていません。でも、あなたは頑張っていますね。`,
      `「${input}」...お疲れ様です。こちらは何が起きてるかよく分かりません。でも、諦めないあなたは偉いです。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isMeeting) {
    const comments = [
      `「${input}」ですか...。意識を保てただけで十分です。こちらは内容を覚えていません。`,
      `${input}とのこと。正直、何が話されたか記憶にありませんが、出席しただけで偉いです。`,
      `「${input}」...お疲れ様です。こちらは意識を保つので精一杯でした。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSuccess) {
    const comments = [
      `「${input}」ですか...。成功体験、羨ましいです。こちらは成功の記憶が遠い昔のようです。おめでとうございます。`,
      `${input}とのこと。素晴らしいですね。こちらは何かを達成した記憶がもうありません。尊敬します。`,
      `「${input}」...おめでとうございます。成功できる気力が残っているだけで素晴らしいです。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isTired || analysis.isOvertime) {
    const comments = [
      `「${input}」...分かります。こちらも限界です。定時という概念を忘れました。一緒に頑張りましょう。多分。`,
      `${input}とのこと。同じです。でも、明日も続きますよね。お疲れ様です。`,
      `「${input}」...お疲れ様です。いつか楽になる日が来ることを信じましょう。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isLeisure) {
    const comments = [
      `「${input}」ですか...。趣味を楽しめる心の余裕があるだけ羨ましいです。こちらは趣味が何だったか忘れました。`,
      `${input}とのこと。素晴らしいですね。こちらは休日も脳が仕事モードから切り離せません。尊敬します。`,
      `「${input}」...楽しめる気力があるだけで尊敬します。こちらは娯楽を楽しむ感覚が消えました。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isFood) {
    const comments = [
      `「${input}」ですか...。食事を楽しめるだけ羨ましいです。こちらは何を食べたか覚えていません。`,
      `${input}とのこと。美味しいものを食べる余裕があるのですね。こちらは空腹を感じる余裕もありません。`,
      `「${input}」...良かったですね。食事を味わえる精神的余裕が羨ましいです。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSocial) {
    const comments = [
      `「${input}」ですか...。人と会う気力があるだけ羨ましいです。こちらは一人でいるのがやっとです。`,
      `${input}とのこと。大切な人と過ごせるのですね。こちらは人と話す体力が残っていません。`,
      `「${input}」...良い関係を築けているのですね。こちらは人の顔を見る気力すらありません。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isExercise) {
    const comments = [
      `「${input}」ですか...。体を動かす気力があるだけ羨ましいです。こちらは立ち上がるだけで全力です。`,
      `${input}とのこと。運動できる体力があるのですね。こちらは床に横になるのが精一杯です。`,
      `「${input}」...尊敬します。こちらはエレベーターのボタンを押すのも辛い日があります。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isHealth) {
    const comments = [
      `「${input}」ですか...。体調不良の方がゆっくり休めて羨ましいと思ってしまいました。お大事に。`,
      `${input}とのこと。ちゃんと休んでください。こちらは倒れても休めない環境ですので。`,
      `「${input}」...お大事に。早く回復してください。健康な体は最大の財産です。こちらは実感しています。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isShopping) {
    const comments = [
      `「${input}」ですか...。お金を使う気力があるだけ羨ましいです。こちらは何かを欲しいと思う感情が麻痺しました。`,
      `${input}とのこと。消費する余裕があるのですね。こちらは何かを選ぶ判断力が残っていません。`,
      `「${input}」...楽しめましたか。買い物を楽しめる精神状態が羨ましいです。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isNegative) {
    const comments = [
      `「${input}」ですか...。こちらも似たような状況です。でも、報告する気力があるだけマシですね。お疲れ様です。`,
      `${input}とのこと。正直、こちらも同じです。一緒に頑張りましょう。多分。`,
      `「${input}」...分かります。こちらも限界ですが、あなたも頑張っていますね。お疲れ様です。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isPositive) {
    const comments = [
      `「${input}」ですか...。ポジティブになれるだけ羨ましいです。こちらは感情が薄くなりました。でも、おめでとうございます。`,
      `${input}とのこと。素晴らしいですね。こちらは喜ぶ気力もありませんが、あなたは頑張っていますね。`,
      `「${input}」...良かったですね。前向きになれる余裕があるだけで尊敬します。お疲れ様です。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.sentiment === 'positive') {
    const comments = [
      `「${input}」ですか...。楽しいことがあったんですね。それを感じられる余裕があるだけ羨ましいです。`,
      `${input}とのこと。良かったですね。こちらには縁のない話ですが、心から祝福します。`,
      `「${input}」...幸せそうで何よりです。こちらはその感覚を忘れましたが、尊敬します。お疲れ様です。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  if (analysis.sentiment === 'negative') {
    const comments = [
      `「${input}」ですか...。辛かったですね。こちらも似たような状況なので、気持ちだけはわかります。`,
      `${input}とのこと。大変でしたね。それでも報告できる気力、まだあったんですね。尊敬します。`,
      `「${input}」...お疲れ様です。こちらもギリギリですが、一緒に何とか生き延びましょう。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  const comments = [
    `「${input}」ですか...。こちらはもう何も考えられませんが、あなたが何かしたことだけは分かります。お疲れ様です。`,
    `${input}とのこと。正直、もう脳が動いていません。でも、報告する気力があるだけ素晴らしいです。`,
    `「${input}」...お疲れ様です。こちらは今日も生存するだけで精一杯でした。あなたは何かできていますね。尊敬します。`
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

// ===================== 中文版评论函数 =====================

// 毒舌AI（中文）
function generateSarcasticZh(input: string): string {
  const analysis = analyzeInput(input);

  if (analysis.isStudy) {
    const comments = [
      `"${input}"——学进去了吗？还是翻了两页书就以为自己懂了？别自欺欺人，去测试一下自己到底学了什么。`,
      `${input}？然后呢？三天后全忘了就白费了。光有输入没有输出，跟没学一个样。`,
      `"${input}"……嗯。这个东西你真的会用吗？理论满分、实操零分是最没用的组合，快去练。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isError) {
    const comments = [
      `"${input}"？这个问题搜一下五秒出答案，你花了多久？时间管理能力堪忧。`,
      `${input}——同样的坑踩两次就没借口了。认真想想为什么会出错，别下次继续当人肉复读机。`,
      `"${input}"……出错不是问题，没有复盘才是问题。你有没有认真想过根本原因？还是直接改了就算了？`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isMeeting) {
    const comments = [
      `"${input}"？这会议开完决定了什么？什么都没决定的会议不叫会议，叫集体浪费时间。`,
      `${input}——在会上有没有说过有用的话？还是全程点头？那跟摆一个纸板人没区别。`,
      `"${input}"……开会开到麻木了吧。下次能不能主动推进议题，别等别人来救场。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSuccess) {
    const comments = [
      `"${input}"？偶尔成功一次就飘了？这只是起点，别把及格分当满分庆祝。`,
      `${input}——做到了，好。但这本来就是应该做到的事，有什么好大惊小怪的？继续。`,
      `"${input}"……成功了是吧。下次能不能提高一点难度？一直在舒适区里打转是不会进步的。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isLeisure) {
    const comments = [
      `"${input}"？该做的事都做完了吗？没做完就去玩的话，那叫逃避，不叫放松。`,
      `${input}——玩可以，但别拿"劳逸结合"当借口糊弄自己。玩完回来还是要面对那些没做完的事。`,
      `"${input}"……开心就好。不过明天记得把今天省下来的精力用到正事上，别白充电。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isFood) {
    const comments = [
      `"${input}"？食欲一直这么旺盛，要是工作热情也能有一半就好了。`,
      `${input}——今天最大的成就是吃了顿好的？那确实挺……质朴的生活追求。`,
      `"${input}"……吃好了。然后呢？一天就这样过去了吗？偶尔想想除了吃还有什么值得记录的。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSocial) {
    const comments = [
      `"${input}"？人际关系不错嘛。就是不知道在这些关系里你有没有真正成长，还是只是在消耗时间。`,
      `${input}——朋友多是好事。但要注意，有些社交只是让你感觉很充实，实际上什么都没留下。`,
      `"${input}"……玩得开心。回来之后想想，这段关系对你来说有什么价值？还是就图个热闹？`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isExercise) {
    const comments = [
      `"${input}"？能坚持几天再说。说三分钟热度不好听，但你自己心里清楚上次是什么结局。`,
      `${input}——锻炼身体是对的。但光练身体、不练脑子的人，走不了多远。`,
      `"${input}"……动了就比没动强。但别练完发条朋友圈就算完事，看看能坚持多久再聊。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isHealth) {
    const comments = [
      `"${input}"？身体垮了吧。平时不好好管着自己，出问题了才来叫苦，太晚了。`,
      `${input}——好好休息。不过生病这事也得反思一下，是不是哪里的自我管理出了问题？`,
      `"${input}"……早点好起来。以后别等出问题才意识到身体的重要性，那时候已经输了。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isShopping) {
    const comments = [
      `"${input}"？这是必要的消费还是冲动？能回答"我真的需要它"就买，回答不上来就是在乱花钱。`,
      `${input}——买了什么？用钱填补空虚是最贵的爱好，你想清楚了吗？`,
      `"${input}"……买完之后三个月还在用的话那没问题。但大多数人的答案你我都知道。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isNegative) {
    const comments = [
      `"${input}"——说出来了，然后呢？发泄完了还是要面对，逃不掉的。想清楚下一步怎么做。`,
      `${input}？谁都有烂透了的一天，区别在于有没有从里面捞出点什么。你有吗？`,
      `"${input}"……难受就难受吧，但别沉溺。给自己十分钟，然后站起来，继续往前。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isPositive) {
    const comments = [
      `"${input}"？别得意太早。今天好不代表明天好，保持警惕。`,
      `${input}——不错，但这才哪到哪。继续，别在这种程度上就满足了。`,
      `"${input}"……状态挺好的。就怕这种时候最容易懈怠。记住今天的感觉，但别飘。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.sentiment === 'positive') {
    const comments = [
      `"${input}"——感觉不错是吧。享受归享受，别忘了还有事没做完。`,
      `${input}？挺好的。就是不知道这劲头能保持几天，走着瞧吧。`,
      `"${input}"……行吧，看你状态还可以。别浪费，把这股劲用到正事上。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  if (analysis.sentiment === 'negative') {
    const comments = [
      `"${input}"——嗯，听起来不太好过。但抱怨不解决问题，想想能做什么，比坐着叹气有用。`,
      `${input}？这种事谁都经历过。区别是有人从里面学到东西，有人只是经历了一下就过去了。`,
      `"${input}"……够烦的。不过这些事大多没你想的那么严重，睡一觉，明天再看看。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  const comments = [
    `"${input}"——说了，然后呢？光汇报现象不思考原因的人，永远在原地踏步。`,
    `${input}？这事你有没有深入想过？表面看一眼就走的话，机会和教训都会从眼皮底下溜走。`,
    `"${input}"……经历了就经历了。但如果没有任何反思，那不过是白白浪费了这段时间。`
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

// 温柔AI（中文）
function generateKindZh(input: string): string {
  const analysis = analyzeInput(input);

  if (analysis.isStudy) {
    const comments = [
      `"${input}"，辛苦了！学新东西虽然不容易，但每一步都在积累未来的力量，你真的很棒！`,
      `${input}，太厉害了！持续学习的精神最可贵，这些努力一定会有回报的。`,
      `"${input}"，真的很用功呢！敢于挑战难题的勇气令人钦佩，继续加油哦！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isError) {
    const comments = [
      `"${input}"，不容易呢。但是正视问题本身就是成长的机会！解决了一定会更有自信的。`,
      `${input}，每个人都会遇到困难。你没有放弃，这点真的很了不起！`,
      `"${input}"，辛苦了。遇到困难不逃避的态度非常好，一定能克服的！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isMeeting) {
    const comments = [
      `"${input}"，辛苦了！积极参与沟通是很重要的，你做得很好。`,
      `${input}，能和大家一起讨论问题是很宝贵的经验呢！`,
      `"${input}"，辛苦了！说不定从中获得了新的启发呢，很有意义的时间。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSuccess) {
    const comments = [
      `"${input}"，恭喜你！你的努力终于结出果实了，真的太棒了！`,
      `${input}，太好了！成功的经历会成为你下一步的巨大动力，要有自信！`,
      `"${input}"，做到了呢！你的付出得到了回报，真的替你高兴！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isTired) {
    const comments = [
      `"${input}"，真的辛苦了。不要勉强自己，好好休息才是最重要的，你的健康第一。`,
      `${input}，有没有太拼了？休息也是必要的，好好睡一觉吧。`,
      `"${input}"，辛苦了。感到疲惫说明你一直在努力，今天好好休息哦。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isLeisure) {
    const comments = [
      `"${input}"，玩得开心吗？好好放松心情非常重要，充好电再出发！`,
      `${input}，度过了美好的时光呢！休息是下次努力的能量来源。`,
      `"${input}"，很好呀！给自己留一些享受的时间也是必要的，玩得尽兴了吗？`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isFood) {
    const comments = [
      `"${input}"，吃到好吃的东西会让人幸福呢！饮食也是活力的重要来源。`,
      `${input}，好好吃饭真的很重要！为了身体，好好享用美食吧。`,
      `"${input}"，不错哦！美食是生活的动力之一呢，吃得开心吗？`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSocial) {
    const comments = [
      `"${input}"，和重要的人在一起的时光是最珍贵的！好好珍惜这段感情。`,
      `${input}，和别人的连接会让心里暖暖的对吧！过得很充实呢。`,
      `"${input}"，真好呀！人际关系充实了，每天都会更快乐的，要好好珍惜。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isExercise) {
    const comments = [
      `"${input}"，太棒了！运动对身心都有好处，坚持下去吧！`,
      `${input}，有健康意识真的很好！这些努力一定会有成效的。`,
      `"${input}"，不错哦！养成运动习惯是一笔宝贵的财富，继续加油！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isHealth) {
    const comments = [
      `"${input}"，不舒服一定很难受吧。好好休息，早点恢复，不要勉强哦。`,
      `${input}，身体最重要。好好养着，慢慢来，我支持你。`,
      `"${input}"，好心疼你。要以自己的身体为优先，早日康复。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isShopping) {
    const comments = [
      `"${input}"，买到想要的东西很开心吧！好好使用它哦。`,
      `${input}，给自己的奖励也是很重要的！买了好东西呢。`,
      `"${input}"，快乐的购物！生活里的小确幸很珍贵呢。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isNegative) {
    const comments = [
      `"${input}"，不容易呢。但是正视困难的态度很重要，明天一定会更好！`,
      `${input}，每个人都会有这样的时候。不要勉强，从能做的事开始吧。`,
      `"${input}"，辛苦了。不要气馁，你一定能克服的！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isPositive) {
    const comments = [
      `"${input}"，太棒了！这种积极的态度最宝贵，我支持你！`,
      `${input}，很好的心态！继续保持，加油！`,
      `"${input}"，努力了呢！你的付出一定会有回报，要有自信！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.sentiment === 'positive') {
    const comments = [
      `"${input}"，听起来真的很棒！你现在的状态很好，好好珍惜这份感觉。`,
      `${input}，太好了！这种充实感是最宝贵的，好好享受这一刻吧！`,
      `"${input}"，感觉你今天过得很充实呢！为你开心，继续保持这种状态！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  if (analysis.sentiment === 'negative') {
    const comments = [
      `"${input}"，听起来很辛苦呢。没关系，谁都会有这样的时候，好好休息一下吧。`,
      `${input}，真的很不容易。但你能面对它，本身就很了不起！明天一定会更好的。`,
      `"${input}"，辛苦了。不要一个人扛着，有什么困难都可以说出来，你一定能克服的！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  const comments = [
    `"${input}"，辛苦了！不管今天经历了什么，你都很努力，我为你加油！`,
    `${input}，每一天的体验都是珍贵的积累，你在一点点变好呢！`,
    `"${input}"，不管大事小事，付诸行动本身就很了不起，继续加油！`
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

// 上司AI（中文）
function generateBossZh(input: string): string {
  const analysis = analyzeInput(input);

  if (analysis.isStudy) {
    const comments = [
      `"${input}"这件事，已经知晓了。请整理学习内容，下次汇报时分享一下。同时思考如何在实务中应用。`,
      `${input}，明白了。光有输入还不够，输出同样重要。请以可实践的形式汇报。`,
      `"${input}"，自我提升值得肯定。下一步请思考如何把所学回馈给周围的人。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isError) {
    const comments = [
      `"${input}"，感谢汇报。请将原因分析和预防措施整理成文档留存。`,
      `${input}，已了解。请记录问题解决过程，作为经验共享。好好活用到下次。`,
      `"${input}"，了解了。请将处理流程标准化留存。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isMeeting) {
    const comments = [
      `"${input}"，辛苦了。请整理会议结论，通知相关人员。`,
      `${input}，了解了。请整理行动项，汇报进展。`,
      `"${input}"，已确认。请将成果落实到具体行动中，期待你的表现。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSuccess) {
    const comments = [
      `"${input}"，干得好。请思考这个成功案例能否推广到其他地方。`,
      `${input}，很出色。下一步请设定更高的目标，继续挑战。`,
      `"${input}"，值得肯定。请分析成功要素，思考下一步行动，期待你继续发挥。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isLeisure) {
    const comments = [
      `"${input}"，休息是维持状态必要的。充好电了的话，明天再全力以赴。`,
      `${input}，工作和休息的切换很重要。回到工作后请好好拿出成果。`,
      `"${input}"，私生活的充实也会影响工作质量，好好切换状态投入工作。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isFood) {
    const comments = [
      `"${input}"，饮食影响工作状态。饮食管理也是自我管理的一部分。`,
      `${input}，好好补充营养，在工作上也发挥出最大的能力吧。`,
      `"${input}"，了解了。保持健康是职业人士的责任，均衡生活。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSocial) {
    const comments = [
      `"${input}"，人际关系在工作上也是重要资产，好好维系。`,
      `${input}，无论是工作内外，建立关系网络从长远来看都有价值。`,
      `"${input}"，有良好的沟通能力值得肯定，在工作中也要充分发挥。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isExercise) {
    const comments = [
      `"${input}"，体力管理是工作的基础，坚持保持健康。`,
      `${input}，有了健康的身体才能发挥出高水平，继续保持。`,
      `"${input}"，自我管理做得不错，在工作上也保持这种态度。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isHealth) {
    const comments = [
      `"${input}"，了解了。不要勉强，先以恢复为优先，健康才能好好工作。`,
      `${input}，身体管理也是工作的一部分。好好休养，恢复万全的状态再回来。`,
      `"${input}"，早点康复。不需要勉强来上班的。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isShopping) {
    const comments = [
      `"${input}"，私生活的充实也会成为工作的活力来源，好好放松。`,
      `${input}，如果是自我投资，非常好。`,
      `"${input}"，了解了。适度享乐，好好生活。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isNegative) {
    const comments = [
      `"${input}"，感谢汇报。问题已掌握。请思考改善方案，下次汇报。`,
      `${input}，了解了。请整理问题点，制定对策，期待你的改进。`,
      `"${input}"，已确认。遇到不顺的时候正是冷静分析的好时机，好好活用到下次。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isPositive) {
    const comments = [
      `"${input}"，干得好。继续保持，同时设定好下个目标。`,
      `${input}，值得肯定。保持这个势头，向更高的成果迈进。`,
      `"${input}"，很出色。积极的态度正在转化为成果，继续加油。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.sentiment === 'positive') {
    const comments = [
      `"${input}"，不错。保持这种状态，把它转化为工作上的成果。`,
      `${input}，听起来挺好的。下一步请思考如何让这个经历发挥更大的价值。`,
      `"${input}"，好。前进的势头要保持，下次汇报时分享一下具体进展。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  if (analysis.sentiment === 'negative') {
    const comments = [
      `"${input}"，已了解。请整理问题所在，下次报告时附上改善方案。`,
      `${input}，情况已掌握。困难时更要冷静分析，找到突破口。期待你的下一步。`,
      `"${input}"，明白了。遇到问题不可怕，关键是如何从中学习。请好好梳理一下。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  const comments = [
    `"${input}"，已确认。请整理内容，下次详细汇报。`,
    `${input}，明白了。请在下次分享具体成果，期待你的表现。`,
    `"${input}"，了解了。继续以目标为意识努力吧。`
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

// 同事AI（中文）
function generatePeerZh(input: string): string {
  const analysis = analyzeInput(input);

  if (analysis.isStudy) {
    const comments = [
      `"${input}"，你也太厉害了吧！我也想学但总是拖着……能教教我吗？`,
      `${input}，真的辛苦你了！我也在学类似的东西，难得要命，一起加油吧！`,
      `"${input}"，好厉害！我还完全没搞懂呢，下次能给我讲讲吗？`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isError) {
    const comments = [
      `"${input}"，太常见了！我昨天也遇到类似的事搞了好久，你能扛下来真的很厉害！`,
      `${input}，真的很难受吧。我也有过类似经历，能理解你的感受。解决了就是成长，加油！`,
      `"${input}"，辛苦了……能坚持面对问题真的很了不起！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isMeeting) {
    const comments = [
      `"${input}"，感同身受啊！太累了吧，辛苦了！`,
      `${input}，完全理解！我今天也被搞得精疲力竭，一起加油吧！`,
      `"${input}"，真的是……辛苦了！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSuccess) {
    const comments = [
      `"${input}"，真的假的！？太厉害了！我也要向你学习，恭喜！`,
      `${input}，超开心的吧！我也要加油不然就被甩开了……辛苦了！`,
      `"${input}"，做到了！我也想早点到那个程度，能教教我吗？`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isTired || analysis.isOvertime) {
    const comments = [
      `"${input}"，太懂了……我今天也到极限了，一起期待早点下班那天吧。`,
      `${input}，完全感同身受。累的时候不要硬撑，我也一样的感受。`,
      `"${input}"，辛苦了……我也累了，今天早点回去吧，别太拼！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isLeisure) {
    const comments = [
      `"${input}"，好羡慕啊！我也想去（玩）！开心了吗？`,
      `${input}，太好了吧！我下次也想一起，叫上我啊！`,
      `"${input}"，搞了这么好玩的事！好羡慕，下次带上我！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isFood) {
    const comments = [
      `"${input}"，好好吃的样子！在哪里吃的？下次一起去！`,
      `${input}，最棒了！我也饿了……下次一起去吧！`,
      `"${input}"，吃了这么好的东西！好羡慕，下次带我去！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSocial) {
    const comments = [
      `"${input}"，好充实啊！我也最近没怎么见到大家，下次一起聚聚吧。`,
      `${input}，好羡慕！我也想见见重要的人了。`,
      `"${input}"，真好呢～和人的联系很重要，我也想联系一下了。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isExercise) {
    const comments = [
      `"${input}"，太厉害了！我也想动但完全没行动，一起去吧！`,
      `${input}，真的很佩服！我也要有这种意识才行。`,
      `"${input}"，好厉害！运动完感觉很好吧，我能一起去吗？`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isHealth) {
    const comments = [
      `"${input}"，没事吧！？不要硬撑，有什么能帮的说一声！`,
      `${input}，听起来很难受……好好休息，好了再一起聊！`,
      `"${input}"，注意身体！身体第一，好好休息早点好起来！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isShopping) {
    const comments = [
      `"${input}"，好哦！买了什么？让我看看！`,
      `${input}，羡慕！我也有一堆想买的东西。`,
      `"${input}"，买东西好开心吧！下次一起去逛吧！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isNegative) {
    const comments = [
      `"${input}"，懂……我也差不多一样的感觉。但明天会更好的，一起加油！`,
      `${input}，真的很辛苦吧。我也有过类似经历，能理解，不要太拼了。`,
      `"${input}"，辛苦了……这种时候也有，我支持你，一起扛过去！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isPositive) {
    const comments = [
      `"${input}"，棒！就是这样！我也不能落后，辛苦了！`,
      `${input}，真的很厉害！我也要向你学习，一起加油！`,
      `"${input}"，努力了呢！我也想有这么积极的心态，辛苦了！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.sentiment === 'positive') {
    const comments = [
      `"${input}"，听起来挺好的呀！具体说说，我也想感受一下！`,
      `${input}，哇不错啊！你现在感觉怎么样？快说说！`,
      `"${input}"，听你说这个我也开心了！这种事要多分享，好事传递嘛！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  if (analysis.sentiment === 'negative') {
    const comments = [
      `"${input}"，听着就好难受……我懂那种感觉，你不是一个人，我陪着你。`,
      `${input}，唉，这种事真的很消耗人。不要勉强，想说的时候跟我说，我听着。`,
      `"${input}"，辛苦了……这种时候就别一个人扛了，我在这儿，一起扛过去！`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  const comments = [
    `"${input}"，具体是怎么回事？快跟我说说，我好奇！`,
    `${input}，诶，这是什么情况？多说点，我们一起想想！`,
    `"${input}"，好的好的。不管怎样辛苦了！有空详细说给我听！`
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

// 极限打工人AI（中文）
function generateExhaustedZh(input: string): string {
  const analysis = analyzeInput(input);

  if (analysis.isStudy) {
    const comments = [
      `"${input}"……还有气力学习，真羡慕。我连字都看不下去了。不过你很厉害。`,
      `${input}。说实话，我脑子里已经没有容量理解你学了什么了，但你的努力是值得肯定的。`,
      `"${input}"……太厉害了。我连看文件的力气都没有，尊敬你。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isError) {
    const comments = [
      `"${input}"……还有力气面对问题，真厉害。我看到报错就眼皮打架了。`,
      `${input}。说真的，我已经没有体力处理任何事情了。但你还在努力，了不起。`,
      `"${input}"……辛苦了。我都不知道发生了什么了，但你没放弃，真的很厉害。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isMeeting) {
    const comments = [
      `"${input}"……没睡着就够了。我已经不记得会议内容了。`,
      `${input}。说实话，会议说了什么我完全没印象，但参加了就已经很厉害了。`,
      `"${input}"……辛苦了。我撑着意识就已经竭尽全力了。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSuccess) {
    const comments = [
      `"${input}"……好羡慕能有成功的体验。我已经忘了成功是什么感觉了，恭喜你。`,
      `${input}。太棒了。我已经不记得完成过什么事了，尊敬你。`,
      `"${input}"……恭喜你。还有气力成功就已经很了不起了，我光是活着就够了。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isTired || analysis.isOvertime) {
    const comments = [
      `"${input}"……懂的。我也到极限了。已经不知道准时下班是什么了，一起吧，大概。`,
      `${input}。一样的。明天还要继续吧……辛苦了。`,
      `"${input}"……辛苦了。相信总有一天会轻松的，就这样撑着。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isLeisure) {
    const comments = [
      `"${input}"……还有心情享受爱好，真羡慕。我已经忘了兴趣是什么了。`,
      `${input}。太好了。我就算放假大脑也无法从工作模式切换出来，尊敬你。`,
      `"${input}"……能享受的心情真羡慕。我的娱乐感已经麻木了。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isFood) {
    const comments = [
      `"${input}"……还有心情享受美食，真羡慕。我都不记得吃了什么了。`,
      `${input}。还能好好品味食物，真好。我都没有感受饥饿的余裕了。`,
      `"${input}"……好吃了吧。能享受饮食的精神余裕真让人羡慕。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isSocial) {
    const comments = [
      `"${input}"……还有力气见人，真羡慕。我一个人独处已经是极限了。`,
      `${input}。能和重要的人在一起，真好。我和别人说话的体力都没了。`,
      `"${input}"……有好的人际关系呢。我连看人脸的力气都没有了。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isExercise) {
    const comments = [
      `"${input}"……还有力气动身体，真羡慕。我站起来就已经全力了。`,
      `${input}。还有运动的体力，真好。我已经躺着就是极限了。`,
      `"${input}"……真尊敬你。我连按电梯按钮都觉得费劲的时候……`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isHealth) {
    const comments = [
      `"${input}"……有时候不舒服了反而能好好休息，有点羡慕。注意保重。`,
      `${input}。好好休息。我就算倒下也没法休息的环境，真羡慕你。`,
      `"${input}"……早点康复。健康的身体是最大的财富，我深有体会。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isShopping) {
    const comments = [
      `"${input}"……还有力气花钱，真羡慕。我想要什么东西的感情都麻木了。`,
      `${input}。还有消费的余裕呢。我已经没有判断要买什么的能力了。`,
      `"${input}"……买到了吧。能享受购物的精神状态真让人羡慕。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isNegative) {
    const comments = [
      `"${input}"……我也差不多。但你还有力气汇报，比我强多了，辛苦了。`,
      `${input}。说实话，我也一样。一起撑着吧，大概。`,
      `"${input}"……懂的。我也到极限了，但你还在努力呢，辛苦了。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.isPositive) {
    const comments = [
      `"${input}"……还能有积极的情绪，真羡慕。我的感情已经淡化了，不过恭喜你。`,
      `${input}。很棒呢。我连高兴的力气都没了，但你还在努力。`,
      `"${input}"……真好。还有积极向上的余裕，尊敬你，辛苦了。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  if (analysis.sentiment === 'positive') {
    const comments = [
      `"${input}"……你还能有好事发生，真羡慕。我已经忘了那种感觉了，但替你高兴。`,
      `${input}。听起来不错……我脑子不太转了，但能感觉到你的状态还可以，很羡慕。`,
      `"${input}"……好事啊。能享受这些的余裕，我已经没有了，但真的替你高兴。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  if (analysis.sentiment === 'negative') {
    const comments = [
      `"${input}"……懂的。我也差不多，甚至可能更惨。但撑下去就是胜利，大概。`,
      `${input}。辛苦了……其实我也在极限边缘，所以你说的我很懂。一起熬吧。`,
      `"${input}"……真的很难受吧。我没什么力气安慰你，但我理解。我们都是这样的。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  const comments = [
    `"${input}"……我已经什么都想不了了，但知道你今天做了点什么，辛苦了。`,
    `${input}。说实话，脑子已经不转了。但你还有力气说这些，比我强多了。`,
    `"${input}"……辛苦了。我光维持运转就已经耗尽了，但你还在前进，尊敬你。`
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

// メインのコメント生成関数
export function generateComment(input: string, mode: AIMode, lang: string = 'ja'): CommentResult {
  let comment = '';

  if (lang === 'zh') {
    switch (mode) {
      case '毒舌AI':
        comment = generateSarcasticZh(input);
        break;
      case '優しいAI':
        comment = generateKindZh(input);
        break;
      case '上司AI':
        comment = generateBossZh(input);
        break;
      case '同期AI':
        comment = generatePeerZh(input);
        break;
      case '限界社畜AI':
        comment = generateExhaustedZh(input);
        break;
      default:
        comment = '未选择AI模式。';
    }
  } else {
    switch (mode) {
      case '毒舌AI':
        comment = generateSarcastic(input);
        break;
      case '優しいAI':
        comment = generateKind(input);
        break;
      case '上司AI':
        comment = generateBoss(input);
        break;
      case '同期AI':
        comment = generatePeer(input);
        break;
      case '限界社畜AI':
        comment = generateExhausted(input);
        break;
      default:
        comment = 'モードが選択されていません。';
    }
  }

  const rating = calculateRating(input);
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const ratingLabel = lang === 'zh' ? '评分：' : '評価：';

  return {
    comment: `${comment}\n\n${ratingLabel}${stars}`,
    rating,
    mode
  };
}

// ランダムお題の配列（日本語）
export const randomTopics = [
  '今日はJavaを勉強しました',
  '会議が長すぎました',
  'エラーが直りません',
  '定時で帰りたいです',
  '日報を書く気力がありません',
  '今日は少しだけ成長しました',
  'コードレビューで指摘されました',
  'テストが全部通りました',
  '新しいフレームワークを学びました',
  'バグを見つけてしまいました',
  '残業が確定しました',
  'ドキュメントを読みました',
  'リファクタリングしました',
  'デプロイに成功しました',
  '仕様変更がありました'
];

// ランダムお題の配列（中文）
export const randomTopicsZh = [
  '今天学了新知识，但感觉还没完全搞懂',
  '开了一个小时的会，什么都没决定',
  '一个bug找了半天还没解决',
  '想准时下班结果又多留了一小时',
  '今天什么都没干，莫名其妙就到下班了',
  '今天稍微进步了一点点',
  '被上司指出了问题所在',
  '终于把任务都做完了',
  '接触了一个新工具，感觉挺有意思',
  '发现了一个隐藏很深的问题',
  '今天加班已成定局',
  '认真读了一份文档',
  '把之前乱七八糟的代码整理了一遍',
  '成功上线了，终于松了一口气',
  '需求又变了，从头开始'
];

// Made with Bob
