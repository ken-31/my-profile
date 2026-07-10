// 螺旋階段ミュージアムの各フロア（ホログラム）コンテンツ
export type MuseumSection = {
    id: string;
    index: string;      // フロア表示番号
    title: string;      // 英語タイトル（HUD・ホログラム見出し）
    subtitle: string;   // 日本語サブタイトル
    lines: { label?: string; text: string }[];
    link?: { label: string; url: string };
};

export const sections: MuseumSection[] = [
    {
        id: 'introduction',
        index: 'B1',
        title: 'INTRODUCTION',
        subtitle: 'ようこそ、僕の記録保管庫へ',
        lines: [
            { text: '望月 — MOCHIZUKI' },
            { text: 'IT系専門学生 / 未来のAIエンジニア' },
            { text: 'スクロールで螺旋階段を降りて、各フロアの展示をご覧ください。' },
        ],
    },
    {
        id: 'about',
        index: 'B2',
        title: 'ABOUT ME',
        subtitle: '自己紹介',
        lines: [
            { label: '年齢', text: '19歳' },
            { label: '血液型', text: 'B型' },
            { label: 'MBTI', text: 'ENTP-A' },
            { label: 'ラブタイプ', text: 'FARE' },
            { text: '甘いもの（特にアイスクリーム）が大好き。現在はITの学校に通いながら、国家資格の勉強中です。' },
        ],
    },
    {
        id: 'skills',
        index: 'B3',
        title: 'SKILLS',
        subtitle: 'スキル / 学習中',
        lines: [
            { label: 'WEB', text: 'HTML / CSS / JavaScript / React / TypeScript' },
            { label: 'AI', text: 'Python・機械学習を学習中' },
            { label: '資格', text: '国家資格（基本情報技術者）勉強中' },
            { label: '音楽', text: 'ギター演奏' },
        ],
    },
    {
        id: 'projects',
        index: 'B4',
        title: 'PROJECTS',
        subtitle: '制作物',
        lines: [
            { label: '01', text: 'ホログラフィック・プロフィールサイト（React + Three.js）' },
            { label: '02', text: '3D螺旋ミュージアム — このサイト自身' },
            { label: '03', text: 'AIエンジニアを目指した学習プロジェクト進行中' },
        ],
    },
    {
        id: 'music',
        index: 'B5',
        title: 'MUSIC & HOBBIES',
        subtitle: '音楽と趣味',
        lines: [
            { label: '音楽', text: 'カネコアヤノ / The Beatles / YUI / King Crimson' },
            { label: '哲学', text: '「描写一つごとにあった音楽を聞きたい」' },
            { label: '趣味', text: '散歩・御朱印集め・喫茶店/カフェ巡り・古着屋巡り' },
        ],
    },
    {
        id: 'timeline',
        index: 'B6',
        title: 'TIMELINE',
        subtitle: 'これまでとこれから',
        lines: [
            { label: 'PAST', text: 'ギターと音楽、街歩きに夢中になる' },
            { label: 'NOW', text: 'IT専門学校で学習中 / 国家資格に挑戦' },
            { label: 'FUTURE', text: 'AIエンジニアとして活躍する' },
        ],
    },
    {
        id: 'contact',
        index: 'B7',
        title: 'CONTACT',
        subtitle: '連絡先',
        lines: [
            { text: '最下層までお越しいただきありがとうございます。' },
            { text: 'DMはこちらまで。' },
        ],
        link: { label: 'INSTAGRAM — @galoisvertex44', url: 'https://www.instagram.com/galoisvertex44/' },
    },
];
