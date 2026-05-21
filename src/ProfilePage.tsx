import React, { useState, useEffect, useRef } from 'react';

// --- スクロール時に上下どちらからでもフェードインさせるための専用コンポーネント ---
const FadeInSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const domRef = useRef<HTMLDivElement>(null);
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // 画面に入ったら表示(true)、画面から出たら非表示(false)に切り替える
                setVisible(entry.isIntersecting);
            });
        }, {
            // 要素が10%画面に入ったらアニメーションを発火
            threshold: 0.1
        });

        if (domRef.current) observer.observe(domRef.current);
        return () => {
            if (domRef.current) observer.unobserve(domRef.current);
        };
    }, []);

    return (
        <div ref={domRef} className={`w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            {children}
        </div>
    );
};

const ProfilePage: React.FC = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const theme = {
        bg: isDarkMode ? 'bg-black' : 'bg-white',
        text: isDarkMode ? 'text-white' : 'text-black',
        textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
        border: isDarkMode ? 'border-white' : 'border-black',
        borderDotted: isDarkMode ? 'border-white/70' : 'border-black/70',
        bgInvert: isDarkMode ? 'bg-white' : 'bg-black',
        textInvert: isDarkMode ? 'text-black' : 'text-white',
        stroke: isDarkMode ? 'stroke-white' : 'stroke-black',
        cardBg: isDarkMode ? 'bg-gray-900/50' : 'bg-gray-100/50',
    };

    // メニュー開閉
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // スムーズスクロール処理
    const handleScrollTo = (e: React.MouseEvent, targetId: string) => {
        e.preventDefault();
        setIsMenuOpen(false);
        if (targetId === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // ★音楽データ
    const musicData = [
        {
            title: 'かみつきたい',
            format: '4th Album 燦々',
            date: '2019.09.05',
            imgUrl: '/images/kaneko.jpg',
            linkUrl: 'https://music.apple.com/jp/album/%E3%81%8B%E3%81%BF%E3%81%A4%E3%81%8D%E3%81%9F%E3%81%84/1476048308?i=1476048310'
        },
        {
            title: 'strawberry fields forever',
            format: 'single',
            date: '1967.02.17',
            imgUrl: '/images/beatles.jpg',
            linkUrl: 'https://music.apple.com/jp/album/%E3%82%B9%E3%83%88%E3%83%AD%E3%83%99%E3%83%AA%E3%83%BC-%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E3%82%BA-%E3%83%95%E3%82%A9%E3%83%BC%E3%82%A8%E3%83%90%E3%83%BC-2009-digital-remaster/1441163490?i=1441163771'
        },
        {
            title: 'Laugh away',
            format: '3rd Album I LOVED YESTERDAY',
            date: '2008.04.09',
            imgUrl: '/images/yui.jpg',
            linkUrl: 'https://music.apple.com/jp/album/laugh-away/1537445609?i=1537445614'
        },
    ];

    // ★カルーセル用の画像のパス
    const carouselItems = [
        '/images/ralph lauren.png',
        '/images/arcteryx.jpg',
        '/images/levis.jpg',
        '/images/carhartt.jpg',
        '/images/nana.jpg'
    ];

    return (
        <div className={`relative min-h-screen ${theme.bg} ${theme.text} font-sans flex flex-col items-center overflow-x-hidden transition-colors duration-500`}>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}</style>

            {/* 背景Z */}
            <div className={`fixed inset-0 z-0 flex justify-center items-center ${isDarkMode ? 'opacity-10' : 'opacity-5'} pointer-events-none select-none transition-opacity duration-500`}>
                <svg viewBox="0 0 200 400" className={`w-full h-full max-w-4xl ${theme.stroke} fill-transparent transition-colors duration-500`} preserveAspectRatio="none">
                    <path d="M160,40 Q60,100 80,200 T140,360" strokeWidth="20" strokeLinecap="round" />
                </svg>
            </div>

            {/* オーバーレイメニュー */}
            <div className={`fixed inset-0 z-40 ${isDarkMode ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'}`}>
                <nav className="flex flex-col gap-10 text-2xl md:text-4xl font-bold tracking-[0.2em] text-center">
                    <a href="#" onClick={(e) => handleScrollTo(e, 'top')} className="hover:text-gray-400 hover:scale-110 transition-all duration-300">PROFILE</a>
                    <a href="#" onClick={(e) => handleScrollTo(e, 'music')} className="hover:text-gray-400 hover:scale-110 transition-all duration-300">FAVORITE MUSIC</a>
                    <a href="#" onClick={(e) => handleScrollTo(e, 'likes')} className="hover:text-gray-400 hover:scale-110 transition-all duration-300">LIKES</a>
                    <a href="#" onClick={(e) => handleScrollTo(e, 'cafes')} className="hover:text-gray-400 hover:scale-110 transition-all duration-300">RECOMMEND CAFE</a>
                    <a href={"https://www.instagram.com/xlekerol44/"} target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 hover:scale-110 transition-all duration-300">INSTAGRAM</a>
                </nav>
            </div>

            {/* ヘッダー部分 */}
            <div className="fixed top-0 w-full flex justify-end items-center p-4 md:p-8 z-50 pointer-events-none">
                <div className="flex items-center gap-6 pointer-events-auto">
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="hover:scale-110 transition-transform duration-300">
                        {isDarkMode ? (
                            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.856 5.144a.75.75 0 00-1.06 1.06l1.591 1.59a.75.75 0 101.06-1.06l-1.59-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.796 18.856a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM6.204 18.856a.75.75 0 01-1.06-1.06l1.591-1.59a.75.75 0 111.06 1.06l-1.59 1.59zM2.25 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM5.144 5.144a.75.75 0 011.06 1.06L4.613 7.795a.75.75 0 01-1.06-1.06l1.591-1.591z" /></svg>
                        ) : (
                            <svg className="w-6 h-6 fill-black" viewBox="0 0 24 24"><path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" /></svg>
                        )}
                    </button>
                    <button onClick={toggleMenu} className="space-y-1.5 flex flex-col items-end cursor-pointer group">
                        <span className={`block h-0.5 ${theme.bgInvert} transition-all duration-300 ease-in-out ${isMenuOpen ? 'w-8 rotate-45 translate-y-2' : 'w-8 group-hover:w-6'}`}></span>
                        <span className={`block h-0.5 ${theme.bgInvert} transition-all duration-300 ease-in-out ${isMenuOpen ? 'w-0 opacity-0' : 'w-8 group-hover:w-8'}`}></span>
                        <span className={`block h-0.5 ${theme.bgInvert} transition-all duration-300 ease-in-out ${isMenuOpen ? 'w-8 -rotate-45 -translate-y-2' : 'w-8 group-hover:w-4'}`}></span>
                    </button>
                </div>
            </div>

            {/* メインコンテンツを囲むコンテナ */}
            <div className="w-full flex flex-col items-center p-4 md:p-12 gap-y-24 md:gap-y-32 max-w-[1200px] mt-12 md:mt-0 pb-24">

                {/* =========================================
                    SECTION 1 : PROFILE
                ========================================= */}
                <FadeInSection>
                    <div id="top" className="relative z-10 w-full flex flex-col md:flex-row md:justify-between gap-10 md:gap-20 min-h-[90vh]">
                        {/* 左側カラム */}
                        <div className="flex flex-col w-full md:flex-1 relative pt-4 md:pt-10">
                            <div className={`absolute top-0 left-0 w-4 h-4 border-t-[2px] border-l-[2px] ${theme.border} md:top-4 transition-colors duration-500`}></div>
                            <div className="pl-2 mb-6 md:mb-10 cursor-default group w-max mt-6 md:mt-0">
                                <h1 className={`text-3xl md:text-5xl font-bold tracking-widest mb-2 transition-all duration-500 group-hover:tracking-[0.4em] ${theme.textMuted}`}>望月</h1>
                                <p className={`text-xs md:text-sm tracking-widest uppercase font-semibold ${theme.textMuted} transition-colors duration-300 group-hover:${theme.text}`}>Name / MCName</p>
                            </div>

                            <div className={`text-xs md:text-sm leading-loose mb-8 md:mb-10 w-[95%] md:w-[85%] font-medium hover:${theme.textMuted} transition-colors duration-500 cursor-default`}>
                                趣味は散歩、御朱印集め、喫茶店/カフェ巡り、ギターを弾くことです。好きな食べ物はアイスクリームで、とにかく甘いものが好きです!! 現在はITの学校に通っています。将来はAIエンジニアになりたいと思っており、そのために国家資格の勉強をしています。よろしくお願いします！
                            </div>

                            {/* Instagramリンク */}
                            <a href={"https://www.instagram.com/xlekerol44/"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mb-8 md:mb-12 cursor-pointer group w-max">
                                <svg className={`w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12`} viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                <span className={`text-base font-semibold tracking-wide transition-colors duration-300 hover:${theme.textMuted}`}>@xlekerol44</span>
                            </a>

                            {/* プロフィールリスト */}
                            <div className="space-y-5 mb-10 w-full md:w-[95%] text-xs md:text-sm font-bold">
                                {[
                                    { label: '年齢', value: '19歳' },
                                    { label: '血液型', value: 'B型' },
                                    { label: '趣味', value: '散歩、ギター、喫茶店/カフェ巡り、御朱印集め/神社巡り、自然界隈' },
                                    { label: 'MBTI', value: 'ENTP-A' },
                                    { label: 'ラブタイプ', value: 'FARE' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-end group cursor-default">
                                        <div className={`w-[4px] h-[12px] ${theme.bgInvert} mr-3 mb-1 shrink-0 transition-transform duration-300 group-hover:scale-y-150`}></div>
                                        <span className={`w-24 tracking-widest shrink-0 mb-1 transition-colors duration-300 hover:${theme.textMuted}`}>{item.label}</span>
                                        <div className={`flex-grow border-b border-dotted ${theme.borderDotted} ml-3 pl-2 pb-1 font-medium whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 group-hover:-translate-y-1`}>
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 土日の過ごし方 */}
                            <div className="mb-10">
                                <div className="flex items-center mb-4 cursor-default group w-max">
                                    <div className={`w-[3px] h-[14px] ${theme.bgInvert} mr-3 transition-transform duration-300 group-hover:rotate-45`}></div>
                                    <span className={`text-base font-bold tracking-widest transition-colors duration-300 hover:${theme.textMuted}`}>土日の過ごし方！</span>
                                </div>
                                <div className="flex flex-col gap-3 items-start text-xs md:text-sm font-bold">
                                    {['# 喫茶店巡り', '# 古着屋巡り', '# 都内探索/遠出'].map((tag, idx) => (
                                        <span key={idx} className={`${theme.bgInvert} ${theme.textInvert} px-3 py-1.5 tracking-wider cursor-pointer border border-transparent hover:${theme.bg} hover:${theme.text} hover:${theme.border} transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 右側カラム */}
                        <div className="flex justify-end gap-4 md:gap-8 w-full md:w-[45%] h-[500px] md:h-auto relative mt-8 md:mt-0">
                            <div className="w-[25%] md:w-24 flex flex-col items-center justify-between py-6 md:py-10 z-20">
                                {/* 丸テキスト */}
                                <div className={`w-16 md:w-20 h-16 md:h-20 rounded-full border ${theme.border} flex items-center justify-center shrink-0 mb-4 ${theme.bg} shadow-sm cursor-default hover:${theme.bgInvert} hover:${theme.textInvert} transition-colors duration-500 group mt-12 md:mt-0`}>
                                    <p className="text-[10px] md:text-xs [writing-mode:vertical-rl] [text-orientation:upright] text-center tracking-widest leading-relaxed font-bold transition-transform duration-300 group-hover:scale-105">
                                        IT系の<br />専門学生してます！
                                    </p>
                                </div>
                                {/* 縦書きテキスト */}
                                <div className="flex flex-col items-center flex-grow justify-center py-4 cursor-default group">
                                    <div className={`text-2xl md:text-3xl font-bold [writing-mode:vertical-rl] tracking-[0.4em] transition-colors duration-500 hover:${theme.textMuted}`}>
                                        散歩大好きまん
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* =========================================
                    SECTION 2 : FAVORITE MUSIC
                ========================================= */}
                <FadeInSection>
                    <div id="music" className="relative z-10 w-full min-h-[90vh]">
                        <div className="w-full flex flex-col items-center">
                            <div className="w-full max-w-4xl relative pt-4 md:pt-10 mb-12 text-center flex flex-col items-center">
                                <div className={`absolute top-0 left-0 w-4 h-4 border-t-[2px] border-l-[2px] ${theme.border} md:top-4 transition-colors duration-500`}></div>
                                <h2 className="text-3xl md:text-5xl font-bold tracking-widest mb-2 mt-4 inline-block relative">
                                    FAVORITE MUSIC
                                </h2>
                                <p className={`text-xs md:text-sm tracking-widest uppercase font-semibold ${theme.textMuted} mb-8`}>好きな音楽</p>
                                <p className="text-xs md:text-sm leading-loose w-[95%] md:w-[85%] font-medium">よく聴く楽曲やアルバム。その時々の気分や影響を受けた音楽たち。</p>
                            </div>

                            {/* ★ 音楽グリッド（aタグに変更してリンク化） */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-16 px-2 [perspective:1000px] place-items-center w-full max-w-5xl">
                                {musicData.map((music, idx) => (
                                    <a
                                        key={idx}
                                        href={music.linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`block border ${theme.borderDotted} rounded-lg p-4 flex flex-col items-center gap-4 ${theme.cardBg} backdrop-blur-sm cursor-pointer transition-transform duration-1000 hover:[transform:rotateY(360deg)] w-full`}
                                    >
                                        <img src={music.imgUrl} alt={music.title} className="w-full h-full aspect-square object-cover rounded shadow-md" />
                                        <div className="text-center w-full">
                                            <h3 className="text-base font-bold tracking-widest mb-1 truncate">{music.title}</h3>
                                            <p className={`text-[10px] font-semibold tracking-wider ${theme.textMuted} uppercase`}>{music.format}</p>
                                            <p className="text-[10px] font-medium tracking-wider text-gray-400">{music.date}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <div className="flex justify-center mb-20 relative">
                                <div className={`absolute -top-px -left-px w-3 h-3 border-t-[2px] border-l-[2px] ${theme.border}`}></div>
                                <div className={`absolute -bottom-px -right-px w-3 h-3 border-b-[2px] border-r-[2px] ${theme.border}`}></div>
                                <button className={`border ${theme.border} text-sm font-bold tracking-widest py-3 px-8 transition-colors duration-300 hover:${theme.bgInvert} hover:${theme.textInvert}`}>
                                    PLAYLISTを見る
                                </button>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* =========================================
                    SECTION 3 : LIKES 
                ========================================= */}
                <FadeInSection>
                    <div id="likes" className="relative z-10 w-full flex flex-col items-center pt-4 md:pt-10 mb-24">
                        <div className="w-full pl-2 mb-12 text-left relative max-w-4xl">
                            <div className={`absolute top-0 left-0 w-4 h-4 border-t-[2px] border-l-[2px] ${theme.border}`}></div>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-widest mb-2 mt-6">LIKES</h2>
                            <p className={`text-xs md:text-sm tracking-widest uppercase font-semibold ${theme.textMuted}`}>好きなブランド</p>
                        </div>

                        <div className="w-full overflow-hidden flex whitespace-nowrap pointer-events-none mt-4">
                            <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-6 pr-6">
                                {carouselItems.map((item, idx) => (
                                    <div key={`first-${idx}`} className={`w-48 h-48 md:w-64 md:h-64 ${theme.cardBg} border ${theme.border} rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden`}>
                                        <img src={item} alt="Likes" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-6 pr-6" aria-hidden="true">
                                {carouselItems.map((item, idx) => (
                                    <div key={`second-${idx}`} className={`w-48 h-48 md:w-64 md:h-64 ${theme.cardBg} border ${theme.border} rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden`}>
                                        <img src={item} alt="Likes" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* =========================================
                    SECTION 4 : RECOMMEND CAFES
                ========================================= */}
                <FadeInSection>
                    <div id="cafes" className="relative z-10 w-full flex flex-col items-center pt-4 md:pt-10 mb-24">
                        <div className="w-full pl-2 mb-12 text-left relative max-w-4xl">
                            <div className={`absolute top-0 left-0 w-4 h-4 border-t-[2px] border-l-[2px] ${theme.border}`}></div>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-widest mb-2 mt-6">CAFES</h2>
                            <p className={`text-xs md:text-sm tracking-widest uppercase font-semibold ${theme.textMuted}`}>都内のおすすめ喫茶店3選</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">

                            {/* --- 喫茶店 1 --- */}
                            <div className={`flex flex-col border ${theme.borderDotted} rounded-lg overflow-hidden ${theme.cardBg} backdrop-blur-sm transition-transform duration-500 hover:-translate-y-2 shadow-sm`}>
                                <div className="w-full h-64 md:h-56">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.9024492375092!2d139.64589309113296!3d35.70401809712562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018f27d22cf60d5%3A0xb4bfa1e3b414cdd!2z44Ki44O844Or5bqnIOiqreabuOmkqA!5e0!3m2!1sja!2sjp!4v1779380309643!5m2!1sja!2sjp"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                                <div className="p-5 flex flex-col gap-1">
                                    <h3 className="font-bold tracking-widest text-lg truncate">アール座 読書館</h3>
                                    <p className={`text-[10px] md:text-xs font-semibold ${theme.textMuted}`}>杉並区高円寺南3丁目</p>
                                    <p className="text-xs mt-3 font-medium leading-relaxed">店内での私語は禁止。静かな空間で読書をしながら美味しい紅茶を楽しむことが出来る。</p>
                                </div>
                            </div>

                            {/* --- 喫茶店 2 (しのカフェ) --- */}
                            <div className={`flex flex-col border ${theme.borderDotted} rounded-lg overflow-hidden ${theme.cardBg} backdrop-blur-sm transition-transform duration-500 hover:-translate-y-2 shadow-sm`}>
                                <div className="w-full h-64 md:h-56">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.593466793662!2d139.65653207578896!3d35.71162047257746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018f28498ae62db%3A0x8bb3f92ecff3432d!2z44GX44Gu44Kr44OV44Kn!5e0!3m2!1sja!2sjp!4v1779379754408!5m2!1sja!2sjp"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                                <div className="p-5 flex flex-col gap-1">
                                    <h3 className="font-bold tracking-widest text-lg truncate">しのカフェ</h3>
                                    <p className={`text-[10px] md:text-xs font-semibold ${theme.textMuted}`}>中野区野方1丁目</p>
                                    <p className="text-xs mt-3 font-medium leading-relaxed">中野区の静かな住宅街の中にある、3匹の猫と触れ合うことが出来る古民家カフェ!</p>
                                </div>
                            </div>

                            {/* --- 喫茶店 3 --- */}
                            <div className={`flex flex-col border ${theme.borderDotted} rounded-lg overflow-hidden ${theme.cardBg} backdrop-blur-sm transition-transform duration-500 hover:-translate-y-2 shadow-sm`}>
                                <div className="w-full h-64 md:h-56">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.448119252419!2d139.70395969999998!3d35.69058869999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188cdb01e97e91%3A0x1faa7dea16f28f27!2z5ZCN5puy4oCi54-I55CyIOaWsOWuv-OCieOCk-OBtuOCiw!5e0!3m2!1sja!2sjp!4v1779379424485!5m2!1sja!2sjp"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                                <div className="p-5 flex flex-col gap-1">
                                    <h3 className="font-bold tracking-widest text-lg truncate">名曲・珈琲 新宿ランブル</h3>
                                    <p className={`text-[10px] md:text-xs font-semibold ${theme.textMuted}`}>新宿区新宿3丁目</p>
                                    <p className="text-xs mt-3 font-medium leading-relaxed">豪華な座席とシャンデリアのある歴史のあるカフェ。コーヒー、デザート、ランチを提供。</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </FadeInSection>

            </div>
        </div>
    );
};

export default ProfilePage;