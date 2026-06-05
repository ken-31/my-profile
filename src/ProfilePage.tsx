import React, { useState, useEffect, useRef } from 'react';

const FadeInSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const domRef = useRef<HTMLDivElement>(null);
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setVisible(true);
            });
        }, { threshold: 0.1 });

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

    const [musicAnimState, setMusicAnimState] = useState<'idle' | 'playing' | 'done'>('idle');
    const [cafeAnimState, setCafeAnimState] = useState<'idle' | 'playing' | 'done'>('idle');

    const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState<number | null>(null);

    const musicRef = useRef<HTMLDivElement>(null);
    const cafesRef = useRef<HTMLDivElement>(null);

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
        flashBg: isDarkMode ? '#000000' : '#ffffff',
    };

    const musicData = [
        { id: '01', title: 'かみつきたい', format: '4th Album 燦々', date: '2019.09.05', imgUrl: '/images/kaneko.jpg', linkUrl: 'https://music.apple.com/jp/album/%E3%81%8B%E3%81%BF%E3%81%A4%E3%81%8D%E3%81%9F%E3%81%84/1476048308?i=1476048310' },
        { id: '02', title: 'strawberry fields forever', format: 'single', date: '1967.02.17', imgUrl: '/images/beatles.jpg', linkUrl: 'https://music.apple.com/jp/album/%E3%82%B9%E3%83%88%E3%83%AD%E3%83%99%E3%83%AA%E3%83%BC-%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E3%82%BA-%E3%83%95%E3%82%A9%E3%83%BC%E3%82%A8%E3%83%90%E3%83%BC-2009-digital-remaster/1441163490?i=1441163771' },
        { id: '03', title: 'Laugh away', format: '3rd Album I LOVED YESTERDAY', date: '2008.04.09', imgUrl: '/images/yui.jpg', linkUrl: 'https://music.apple.com/jp/album/laugh-away/1537445609?i=1537445614' },
    ];

    const playlistData = [
        {
            no: '01', t: '洋楽ロック',
            songs: [
                { title: 'All You Need Is Love', artist: 'The Beatles', album: 'The Beatles 1967-1970', time: '3:49' },
                { title: "Don't be cruel", artist: 'Elvis Presley', album: 'The essential Elvis Presley', time: '2:05' },
                { title: '21st Century Schizoid Man', artist: 'King Crimson', album: 'In the Court of the Crimson King', time: '7:23' },
                { title: 'Nemesis', artist: 'Arch Enemy', album: 'Doomsday Machine', time: '3:58' },
                { title: 'ZOMBIFIED', artist: 'Falling In Reverse', album: 'ZOMBIFIED - Single', time: '3:39' },
                { title: 'Crazy Train', artist: 'Ozzy Osbourne', album: 'Blizzard of Ozz', time: '4:53' },
                { title: 'CARRY ON', artist: 'ANGRA', album: 'ANGLES CRY', time: '5:04' },
            ]
        },
        {
            no: '02', t: '散歩知てるときに聞いている曲',
            songs: [
                { title: '光の方へ', artist: 'カネコアヤノ', album: '燦々', time: '3:50' },
                { title: '明るい未来', artist: 'never young beach', album: 'fam fam', time: '3:54' },
                { title: '目の下', artist: '柴田聡子', album: 'Your Favorite Things', time: '3:14' },
                { title: 'Baby Powder', artist: 'Janevieve', album: 'Division', time: '2:57' },
                { title: '君が泣くなら', artist: 'Lamp', album: '東京ユウトピア通信', time: '4:57' },
                { title: 'Viva Nao Mais', artist: 'Freddie Dredd', album: 'Viva Nao Mais - Single', time: '2:04' },
            ]
        },
        {
            no: '03', t: '街の中でゆっくり聴く曲',
            songs: [
                { title: '丸の内サディスティック', artist: '椎名林檎', album: '無罪モラトリアム', time: '3:55' },
                { title: 'NIGHT TOWN', artist: 'フレンズ', album: 'コンコロール', time: '4:10' },
                { title: 'Plastic Love', artist: '竹内まりや', album: 'VARIETY', time: '4:51' },
                { title: '琥珀色の街、上海蟹の朝', artist: 'くるり', album: '琥珀色の街、上海蟹の朝', time: '5:05' },
            ]
        },
        {
            no: '04', t: '心が疲れたときに寄り添う曲',
            songs: [
                { title: '笑えれば', artist: 'ウルフルズ', album: 'ええねん', time: '4:45' },
                { title: 'やさしさで溢れるように', artist: 'JUJU', album: 'What\'s Love?', time: '4:52' },
                { title: '手紙 〜拝啓 十五の君へ〜', artist: 'アンジェラ・アキ', album: 'ANSWER', time: '5:12' },
            ]
        },
    ];

    const cafeData = [
        {
            no: '01', n: 'アール座 読書館', a: '杉並区高円寺南3丁目', tag: ['#読書', '#静寂'],
            mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.9024492375092!2d139.64589309113296!3d35.70401809712562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018f27d22cf60d5%3A0xb4bfa1e3b414cdd!2z44Ki44O844Or5bqnIOiqreabuOmkqA!5e0!3m2!1sja!2sjp!4v1779380309643!5m2!1sja!2sjp'
        },
        {
            no: '02', n: 'しのカフェ', a: '中野区野方1丁目', tag: ['#古民家', '#猫'],
            mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.593466793662!2d139.65653207578896!3d35.71162047257746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018f28498ae62db%3A0x8bb3f92ecff3432d!2z44GX44Gu44Kr44OV44Kn!5e0!3m2!1sja!2sjp!4v1779379754408!5m2!1sja!2sjp'
        },
        {
            no: '03', n: '名曲・珈琲 新宿ランブル', a: '新宿区新宿3丁目', tag: ['#名曲', '#シャンデリア'],
            mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.448119252419!2d139.70395969999998!3d35.69058869999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188cdb01e97e91%3A0x1faa7dea16f28f27!2z5ZCN5puy4oCi54-I55CyIOaWsOWuv-OCieOCk-OBtuOCiw!5e0!3m2!1sja!2sjp!4v1779379424485!5m2!1sja!2sjp'
        }
    ];

    const uniqueAreasCount = new Set(cafeData.map(c => c.a.split('区')[0] + '区')).size;

    useEffect(() => {
        const observerOptions = { threshold: 0.1 };

        const musicObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setMusicAnimState(prev => {
                        if (prev === 'idle') {
                            document.getElementById('music-title')?.scrollIntoView({ behavior: 'auto', block: 'start' });
                            setTimeout(() => setMusicAnimState('done'), 3800);
                            return 'playing';
                        }
                        return prev;
                    });
                }
            });
        }, observerOptions);

        const cafesObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setCafeAnimState(prev => {
                        if (prev === 'idle') {
                            document.getElementById('cafes-title')?.scrollIntoView({ behavior: 'auto', block: 'start' });
                            setTimeout(() => setCafeAnimState('done'), 4500);
                            return 'playing';
                        }
                        return prev;
                    });
                }
            });
        }, observerOptions);

        if (musicRef.current) musicObserver.observe(musicRef.current);
        if (cafesRef.current) cafesObserver.observe(cafesRef.current);

        return () => {
            if (musicRef.current) musicObserver.unobserve(musicRef.current);
            if (cafesRef.current) cafesObserver.unobserve(cafesRef.current);
        };
    }, []);

    useEffect(() => {
        if (musicAnimState === 'playing' || cafeAnimState === 'playing' || selectedPlaylistIndex !== null) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [musicAnimState, cafeAnimState, selectedPlaylistIndex]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


    const carouselBaseItems = [
        '/images/ralph lauren.png', '/images/arcteryx.jpg', '/images/levis.jpg', '/images/carhartt.jpg', '/images/nana.jpg'
    ];
    const carouselItems = [...carouselBaseItems, ...carouselBaseItems];

    return (
        <div className={`relative min-h-screen ${theme.bg} ${theme.text} font-sans flex flex-col items-center overflow-x-hidden transition-colors duration-500`}>

            <style>{`
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
                .animate-marquee { animation: marquee 25s linear infinite; }
                ::-webkit-scrollbar { display: none; }
                * { -ms-overflow-style: none; scrollbar-width: none; }
                
                @keyframes drop-giant-box { 0% { transform: scale(3) translateY(-100vh) rotate(-35deg); opacity: 0; } 50% { transform: scale(1) translateY(0) rotate(15deg); opacity: 1; } 65% { transform: scale(1.1) translateY(-20px) rotate(-5deg); } 80% { transform: scale(0.98) translateY(0) rotate(0deg); } 100% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; } }
                .anim-drop-box { opacity: 0; animation: drop-giant-box 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.15) 0.2s both; }

                @keyframes burst-notes { 0% { transform: translate(0, 0) scale(0.3); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(var(--mx), var(--my)) scale(1.8) rotate(var(--mr)); opacity: 0; } }
                .anim-burst-note { opacity: 0; animation: burst-notes 1.1s ease-out 1.5s both; }

                @keyframes shatter-tl { 0% { transform: translate(0,0) rotate(0); opacity:1; } 100% { transform: translate(-120vw, -120vh) rotate(-35deg); opacity:0; } }
                @keyframes shatter-tr { 0% { transform: translate(0,0) rotate(0); opacity:1; } 100% { transform: translate(120vw, -120vh) rotate(35deg); opacity:0; } }
                @keyframes shatter-bl { 0% { transform: translate(0,0) rotate(0); opacity:1; } 100% { transform: translate(-120vw, 120vh) rotate(25deg); opacity:0; } }
                @keyframes shatter-br { 0% { transform: translate(0,0) rotate(0); opacity:1; } 100% { transform: translate(120vw, 120vh) rotate(-25deg); opacity:0; } }
                
                .anim-shatter-tl { clip-path: polygon(0 0, 100% 0, 50% 50%, 0 100%); animation: shatter-tl 0.8s cubic-bezier(0.25, 1, 0.5, 1) 2.8s both; }
                .anim-shatter-tr { clip-path: polygon(100% 0, 100% 100%, 50% 50%); animation: shatter-tr 0.8s cubic-bezier(0.25, 1, 0.5, 1) 2.8s both; }
                .anim-shatter-bl { clip-path: polygon(0 100%, 50% 50%, 100% 100%); animation: shatter-bl 0.8s cubic-bezier(0.25, 1, 0.5, 1) 2.8s both; }
                .anim-shatter-br { clip-path: polygon(0 0, 50% 50%, 0 100%); animation: shatter-br 0.8s cubic-bezier(0.25, 1, 0.5, 1) 2.8s both; }

                @keyframes tilt-pot { 0% { transform: rotate(0deg); opacity: 0; } 5% { opacity: 1; } 15% { transform: rotate(-35deg); opacity: 1; } 80% { transform: rotate(-35deg); opacity: 1; } 100% { transform: rotate(0deg); opacity: 0; } }
                .anim-tilt-pot { opacity: 0; animation: tilt-pot 1.8s ease-in-out 0.2s both; }

                @keyframes mega-pour-line { 0% { height: 0px; transform: translateY(0); opacity: 0; } 15% { height: 110px; transform: translateY(0); opacity: 1; } 75% { height: 110px; transform: translateY(0); opacity: 1; } 100% { height: 0px; transform: translateY(110px); opacity: 0; } }
                .anim-mega-pour { opacity: 0; animation: mega-pour-line 1.4s ease-in 0.45s both; }

                @keyframes steam-whiteout { 0% { transform: scale(0.1); opacity: 0; filter: blur(15px); background: #ffffff; } 30% { transform: scale(2.2); opacity: 0.6; filter: blur(35px); background: #ffffff; } 60% { transform: scale(5); opacity: 1; filter: blur(5px); background: var(--flash-color); } 100% { transform: scale(7); opacity: 1; filter: blur(0px); background: var(--flash-color); } }
                .anim-steam-whiteout { opacity: 0; animation: steam-whiteout 2.2s ease-out 1.5s both; }

                @keyframes fade-out-overlay { 0% { opacity: 1; visibility: visible; } 100% { opacity: 0; visibility: hidden; } }
                .anim-fade-out-screen { animation: fade-out-overlay 0.8s ease-in-out 3.7s both; }
            `}</style>

            <div className={`fixed inset-0 z-0 flex justify-center items-center ${isDarkMode ? 'opacity-10' : 'opacity-5'} pointer-events-none select-none transition-opacity duration-500`}>
                <svg viewBox="0 0 200 400" className={`w-full h-full max-w-4xl ${theme.stroke} fill-transparent transition-colors duration-500`} preserveAspectRatio="none"><path d="M160,40 Q60,100 80,200 T140,360" strokeWidth="20" strokeLinecap="round" /></svg>
            </div>

            {selectedPlaylistIndex !== null && (
                <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-black/80' : 'bg-stone-500/50'}`}>

                    <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedPlaylistIndex(null)}></div>

                    <button
                        className="absolute top-6 right-6 md:top-10 md:right-10 z-50 text-white hover:scale-110 transition-transform bg-black/40 rounded-full p-2 backdrop-blur"
                        onClick={() => setSelectedPlaylistIndex(null)}
                    >
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <div className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden pointer-events-none">

                        <button
                            className={`absolute left-2 md:left-8 z-50 w-12 h-12 rounded-full border border-zinc-500 flex items-center justify-center pointer-events-auto transition-transform ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white text-black'} ${selectedPlaylistIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}`}
                            onClick={(e) => { e.stopPropagation(); setSelectedPlaylistIndex(prev => Math.max(0, (prev || 0) - 1)); }}
                            disabled={selectedPlaylistIndex === 0}
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <button
                            className={`absolute right-2 md:right-8 z-50 w-12 h-12 rounded-full border border-zinc-500 flex items-center justify-center pointer-events-auto transition-transform ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white text-black'} ${selectedPlaylistIndex === playlistData.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}`}
                            onClick={(e) => { e.stopPropagation(); setSelectedPlaylistIndex(prev => Math.min(playlistData.length - 1, (prev || 0) + 1)); }}
                            disabled={selectedPlaylistIndex === playlistData.length - 1}
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                        </button>

                        {playlistData.map((pl, idx) => {
                            const offset = idx - selectedPlaylistIndex;
                            const isCenter = offset === 0;

                            let transformClass = "";
                            let zIndex = 0;
                            if (offset === 0) { transformClass = "translate-x-0 scale-100 opacity-100"; zIndex = 30; }
                            else if (offset === 1) { transformClass = "translate-x-[90%] scale-90 opacity-40 blur-[1px]"; zIndex = 20; }
                            else if (offset === -1) { transformClass = "-translate-x-[90%] scale-90 opacity-40 blur-[1px]"; zIndex = 20; }
                            else if (offset > 1) { transformClass = "translate-x-[150%] scale-75 opacity-0"; zIndex = 10; }
                            else if (offset < -1) { transformClass = "-translate-x-[150%] scale-75 opacity-0"; zIndex = 10; }

                            return (
                                <div
                                    key={idx}
                                    className={`absolute w-[88%] md:w-[75%] lg:w-[60%] max-w-5xl h-full flex flex-col transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'} shadow-2xl pointer-events-auto ${transformClass}`}
                                    style={{ zIndex }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isCenter) setSelectedPlaylistIndex(idx);
                                    }}
                                >
                                    <div className="p-8 text-center shrink-0 border-b border-current/10">
                                        <h2 className="text-2xl md:text-4xl font-bold tracking-widest">{pl.t}</h2>
                                        <p className="text-xs mt-2 opacity-50 uppercase tracking-widest">{pl.songs.length} songs</p>
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 pt-4 custom-scrollbar">
                                        <div className="w-full text-left text-xs md:text-sm">
                                            <div className="grid grid-cols-[3rem_1fr_auto] md:grid-cols-[3rem_2fr_2fr_2fr_auto] gap-4 mb-4 font-bold pb-2 opacity-50 border-b border-current/20">
                                                <div className="text-center">#</div>
                                                <div>曲</div>
                                                <div className="hidden md:block">アーティスト</div>
                                                <div className="hidden md:block">アルバム</div>
                                                <div className="text-right">時間</div>
                                            </div>
                                            {pl.songs.map((song, sIdx) => (
                                                <div key={sIdx} className="grid grid-cols-[3rem_1fr_auto] md:grid-cols-[3rem_2fr_2fr_2fr_auto] items-center gap-4 py-4 border-b border-current/10 hover:bg-current/5 transition-colors cursor-default">
                                                    <div className="w-10 h-10 border border-current/20 rounded-md bg-zinc-500/10 flex items-center justify-center shrink-0 mx-auto">
                                                        <svg className="w-5 h-5 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                                                    </div>
                                                    <div className="font-bold truncate text-base">{song.title}</div>
                                                    <div className="hidden md:block opacity-80 truncate">{song.artist}</div>
                                                    <div className="hidden md:block opacity-80 truncate">{song.album}</div>
                                                    <div className="flex items-center gap-6 justify-end">
                                                        <span className="opacity-60 font-mono text-sm">{song.time}</span>
                                                        <svg className="w-5 h-5 opacity-40 hover:opacity-100 cursor-pointer transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="absolute bottom-[-2rem] flex gap-3 z-50 pointer-events-auto">
                            {playlistData.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer border border-white/50 ${idx === selectedPlaylistIndex ? 'bg-white scale-125' : 'bg-transparent hover:bg-white/50'}`}
                                    onClick={(e) => { e.stopPropagation(); setSelectedPlaylistIndex(idx); }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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

            <div className="w-full flex flex-col items-center p-4 md:p-12 gap-y-24 md:gap-y-32 max-w-[1200px] mt-12 md:mt-0 pb-24">

                <FadeInSection>
                    <div id="top" className="relative z-10 w-full flex flex-col md:flex-row md:justify-between gap-10 md:gap-20 min-h-[90vh]">
                        <div className="flex flex-col w-full md:flex-1 relative pt-4 md:pt-10">
                            <div className={`absolute top-0 left-0 w-4 h-4 border-t-[2px] border-l-[2px] ${theme.border} md:top-4 transition-colors duration-500`}></div>
                            <div className="pl-2 mb-6 md:mb-10 cursor-default group w-max mt-6 md:mt-0">
                                <h1 className={`text-3xl md:text-5xl font-bold tracking-widest mb-2 transition-all duration-500 group-hover:tracking-[0.4em] ${theme.textMuted}`}>望月</h1>
                                <p className={`text-xs md:text-sm tracking-widest uppercase font-semibold ${theme.textMuted} transition-colors duration-300 group-hover:${theme.text}`}>Name / MCName</p>
                            </div>

                            <div className={`text-xs md:text-sm leading-loose mb-8 md:mb-10 w-[95%] md:w-[85%] font-medium hover:${theme.textMuted} transition-colors duration-500 cursor-default`}>
                                趣味は散歩、御朱印集め、喫茶店/カフェ巡り、ギターを弾くことです。好きな食べ物はアイスクリームで、とにかく甘いものが好きです!! 現在はITの学校に通っています。将来はAIエンジニアになりたいと思っており、そのために国家資格の勉強をしています。よろしくお願いします！
                            </div>

                            <a href={"https://www.instagram.com/xlekerol44/"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mb-8 md:mb-12 cursor-pointer group w-max">
                                <svg className={`w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12`} viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                <span className={`text-base font-semibold tracking-wide transition-colors duration-300 hover:${theme.textMuted}`}>@xlekerol44</span>
                            </a>

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

                        <div className="flex justify-end gap-4 md:gap-8 w-full md:w-[45%] h-[500px] md:h-auto relative mt-8 md:mt-0">
                            <div className="w-[25%] md:w-24 flex flex-col items-center justify-between py-6 md:py-10 z-20">
                                <div className={`w-16 md:w-20 h-16 md:h-20 rounded-full border ${theme.border} flex items-center justify-center shrink-0 mb-4 ${theme.bg} shadow-sm cursor-default hover:${theme.bgInvert} hover:${theme.textInvert} transition-colors duration-500 group mt-12 md:mt-0`}>
                                    <p className="text-[10px] md:text-xs [writing-mode:vertical-rl] [text-orientation:upright] text-center tracking-widest leading-relaxed font-bold transition-transform duration-300 group-hover:scale-105">
                                        IT系の<br />専門学生してます！
                                    </p>
                                </div>
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
                <div id="music" className="relative w-full min-h-[90vh] flex flex-col items-center overflow-visible pt-10">
                    <div id="music-title" ref={musicRef} className="w-full h-1 scroll-mt-24 md:scroll-mt-32"></div>

                    {musicAnimState === 'playing' && (
                        <div className="fixed inset-0 z-40 overflow-hidden pointer-events-none">
                            <div className={`absolute inset-0 ${theme.bgInvert} flex items-center justify-center anim-shatter-tl`}></div>
                            <div className={`absolute inset-0 ${theme.bgInvert} flex items-center justify-center anim-shatter-tr`}></div>
                            <div className={`absolute inset-0 ${theme.bgInvert} flex items-center justify-center anim-shatter-bl`}></div>
                            <div className={`absolute inset-0 ${theme.bgInvert} flex items-center justify-center anim-shatter-br`}></div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                <div className={`${theme.textInvert} anim-drop-box mb-6`}>
                                    <svg className="w-48 h-48 stroke-current fill-transparent" strokeWidth="1.2" viewBox="0 0 24 24">
                                        <rect x="2" y="6" width="20" height="14" rx="2" />
                                        <circle cx="6.5" cy="13" r="2.5" />
                                        <circle cx="17.5" cy="13" r="2.5" />
                                        <line x1="2" y1="9" x2="22" y2="9" />
                                        <path d="M17 6L19 3H5L7 6" />
                                    </svg>
                                </div>
                                <div className={`absolute ${theme.textInvert} font-bold`}>
                                    <span className="absolute text-5xl anim-burst-note" style={{ '--mx': '-25vw', '--my': '-30vh', '--mr': '-45deg' } as React.CSSProperties}>♩</span>
                                    <span className="absolute text-6xl anim-burst-note" style={{ '--mx': '30vw', '--my': '-25vh', '--mr': '60deg' } as React.CSSProperties}>♪</span>
                                    <span className="absolute text-5xl anim-burst-note" style={{ '--mx': '-35vw', '--my': '20vh', '--mr': '-90deg' } as React.CSSProperties}>♫</span>
                                    <span className="absolute text-7xl anim-burst-note" style={{ '--mx': '25vw', '--my': '35vh', '--mr': '120deg' } as React.CSSProperties}>♬</span>
                                    <span className="absolute text-6xl anim-burst-note" style={{ '--mx': '0vw', '--my': '-40vh', '--mr': '15deg' } as React.CSSProperties}>♩</span>
                                    <span className="absolute text-5xl anim-burst-note" style={{ '--mx': '-15vw', '--my': '40vh', '--mr': '-30deg' } as React.CSSProperties}>♪</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`w-full transition-all duration-1000 transform ${musicAnimState === 'done' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                        <p className={`text-sm tracking-widest uppercase mb-2 ${theme.textMuted}`}>About Me</p>
                        <h2 className="text-5xl md:text-7xl font-bold mb-12 tracking-tight">My Favorite Music.</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-8">
                                <div className={`flex justify-between items-end mb-6 border-b ${theme.borderDotted} pb-4`}>
                                    <h3 className="text-xl font-bold uppercase italic">Top {musicData.length} Albums</h3>
                                    <span className="text-xs font-bold opacity-50 cursor-pointer hover:opacity-100">VIEW ALL →</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 [perspective:1000px]">
                                    {musicData.map((alb) => (
                                        <a key={alb.id} href={alb.linkUrl} target="_blank" rel="noopener noreferrer" className="group block cursor-pointer">
                                            <div className="aspect-square mb-4 relative overflow-hidden rounded shadow-md transition-transform duration-1000 group-hover:[transform:rotateY(360deg)]">
                                                <img src={alb.imgUrl} alt={alb.title} className="w-full h-full object-cover" />
                                                <span className="absolute top-4 left-4 text-4xl font-black opacity-30 text-white/50">{alb.id}</span>
                                                <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-tighter opacity-0 group-hover:opacity-100 bg-black/60 text-white transition-all">Play Song</div>
                                            </div>
                                            <h4 className="font-bold text-base mb-1 tracking-widest truncate">{alb.title}</h4>
                                            <p className={`text-[10px] font-semibold tracking-wider ${theme.textMuted} uppercase`}>{alb.format}</p>
                                            <p className="text-[10px] font-medium tracking-wider text-gray-400">{alb.date}</p>
                                        </a>
                                    ))}
                                </div>

                                <div className="mb-16">
                                    <h3 className={`text-xl font-bold uppercase mb-8 border-b ${theme.borderDotted} pb-4 italic`}>Favorite Artists</h3>
                                    <div className="flex flex-wrap gap-8 items-center">
                                        {['Radiohead', 'Bon Iver', 'The 1975', 'Cigarettes After Sex', 'YOASOBI', 'People In The Box'].map(a => (
                                            <div key={a} className="flex flex-col items-center gap-3 group cursor-pointer">
                                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-200 overflow-hidden ring-0 group-hover:ring-2 ${theme.border} transition-all`}></div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-center">{a}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={`p-10 border ${theme.borderDotted} border-dashed`}>
                                    <p className={`text-xs uppercase mb-4 opacity-50 ${theme.textMuted}`}>My Music Philosophy</p>
                                    <p className="text-2xl md:text-3xl font-serif italic leading-relaxed">
                                        「言葉は、言葉にならない気持ちを形にしてくれるもの。」
                                    </p>
                                    <p className={`text-sm mt-6 leading-loose opacity-80 ${theme.textMuted}`}>
                                        言葉にできない、つらい時。そっと寄り添ってくれる音楽が大好きです。<br />
                                        ジャンルにこだわらず、その瞬間の心に響く、大切な音たちをここに集めています。
                                    </p>
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                <div className={`${theme.cardBg} p-6 h-full border ${theme.borderDotted}`}>
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="font-black uppercase tracking-tighter">My Playlist</h3>
                                        <span className="text-[10px] opacity-50 cursor-pointer hover:opacity-100">VIEW ALL →</span>
                                    </div>
                                    <div className="space-y-6">
                                        {playlistData.map((pl, idx) => (
                                            <div
                                                key={pl.no}
                                                className={`flex items-center gap-4 group cursor-pointer border-b ${theme.borderDotted} pb-4`}
                                                onClick={() => setSelectedPlaylistIndex(idx)}
                                            >
                                                <span className="text-xs font-bold opacity-30">{pl.no}</span>
                                                <div className="flex-grow">
                                                    <p className="text-sm font-bold group-hover:translate-x-1 transition-transform">{pl.t}</p>
                                                    <p className="text-[10px] opacity-50">{pl.songs.length} songs</p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={`mt-20 p-4 border ${theme.borderDotted}`}>
                                        <p className="text-[9px] uppercase font-bold mb-4 opacity-50 tracking-widest">Now Playing</p>
                                        <div className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-zinc-800 shrink-0 animate-pulse"></div>
                                            <div>
                                                <p className="text-xs font-bold">かみつきたい</p>
                                                <p className="text-[10px] opacity-60 italic">カネコアヤノ</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 w-full h-[1px] bg-zinc-500/30 relative">
                                            <div className="absolute left-0 top-0 h-full bg-current w-1/3"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
                                        <img src={item} alt="Likes" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    </div>
                                ))}
                            </div>
                            <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-6 pr-6" aria-hidden="true">
                                {carouselItems.map((item, idx) => (
                                    <div key={`second-${idx}`} className={`w-48 h-48 md:w-64 md:h-64 ${theme.cardBg} border ${theme.border} rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden`}>
                                        <img src={item} alt="Likes" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* =========================================
                    SECTION 4 : RECOMMEND CAFES
                ========================================= */}
                <div id="cafes" className="relative w-full flex flex-col items-center pt-10 mb-24 overflow-visible">
                    <div id="cafes-title" ref={cafesRef} className="w-full h-1 scroll-mt-24 md:scroll-mt-32"></div>

                    {cafeAnimState === 'playing' && (
                        <div className={`fixed inset-0 z-40 ${theme.bgInvert} flex flex-col items-center justify-center anim-fade-out-screen pointer-events-none`}>
                            <div className="relative w-64 h-80 flex flex-col items-center justify-center">
                                <div className={`absolute top-[20px] left-[55%] origin-bottom-left anim-tilt-pot z-20 ${theme.textInvert}`}>
                                    <svg className="w-24 h-24 stroke-current fill-transparent transform -scale-x-100" strokeWidth="1" viewBox="0 0 24 24">
                                        <path d="M2 14h14a4 4 0 0 0 4-4V5H4v5a4 4 0 0 0 4 4z" />
                                        <path d="M20 7h2v3a2 2 0 0 1-2 2" />
                                        <path d="M4 5l-2-2h4" />
                                    </svg>
                                </div>
                                <div className="absolute top-[80px] left-[49%] w-3 bg-[#4A2C0F] anim-mega-pour rounded-full z-10"></div>
                                <div className={`absolute top-[180px] left-[50%] transform -translate-x-1/2 z-20 ${theme.textInvert}`}>
                                    <svg className="w-28 h-28 stroke-current fill-transparent" strokeWidth="1" viewBox="0 0 24 24">
                                        <path d="M18 8h2a3 3 0 0 1 0 6h-2" />
                                        <path d="M2 8h16v7a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V8z" />
                                        <line x1="1" y1="22" x2="19" y2="22" />
                                    </svg>
                                </div>
                            </div>
                            <div className="absolute bottom-[20%] w-[150px] h-[150px] rounded-full anim-steam-whiteout" style={{ '--flash-color': theme.flashBg } as React.CSSProperties}></div>
                        </div>
                    )}

                    <div className={`w-full flex flex-col transition-opacity duration-1000 ${cafeAnimState === 'done' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className="mb-20 w-full pl-2">
                            <p className={`text-xs uppercase mb-2 tracking-widest opacity-60 ${theme.textMuted}`}>Cafe Guide</p>
                            <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tighter italic">My Favorite Cafes.</h2>
                            <div className={`flex gap-12 items-center border-y ${theme.borderDotted} py-8`}>
                                {[
                                    { label: 'Visit Count', val: cafeData.length, unit: 'places' },
                                    { label: 'Areas', val: uniqueAreasCount, unit: 'cities' },
                                    { label: 'Saved', val: cafeData.length, unit: 'favorites' }
                                ].map(s => (
                                    <div key={s.label}>
                                        <p className={`text-[10px] uppercase font-bold opacity-50 mb-1 ${theme.textMuted}`}>{s.label}</p>
                                        <p className="text-3xl font-black">{s.val} <span className="text-xs font-normal opacity-50">{s.unit}</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
                            <div className="lg:col-span-3 space-y-12">
                                <div className={`p-6 border ${theme.borderDotted} space-y-8`}>
                                    <h3 className={`font-bold uppercase border-b ${theme.borderDotted} pb-4 text-sm`}>Search & Filter</h3>
                                    <div className="relative">
                                        <input type="text" placeholder="Search cafes..." className={`w-full bg-transparent border-b ${theme.borderDotted} py-2 text-xs outline-none focus:border-current transition-colors ${theme.text}`} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-bold opacity-40 uppercase">Area</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['渋谷', '中野', '高円寺', '銀座', '新宿'].map(tag => (
                                                <span key={tag} className={`px-3 py-1 border ${theme.borderDotted} text-[9px] rounded-full hover:${theme.bgInvert} hover:${theme.textInvert} transition-colors cursor-pointer`}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-bold opacity-40 uppercase">Category</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['古民家', '純喫茶', 'モダン', '読書', '静か', '猫'].map(tag => (
                                                <span key={tag} className={`px-2 py-4 border ${theme.borderDotted} text-[9px] text-center hover:${theme.bgInvert} hover:${theme.textInvert} transition-colors cursor-pointer`}>#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={`aspect-square ${theme.cardBg} border ${theme.borderDotted} flex items-center justify-center text-xs opacity-40 italic`}>MAP PREVIEW</div>
                            </div>

                            <div className="lg:col-span-9 space-y-16">
                                <div className="flex justify-between items-end mb-8">
                                    <h3 className="text-xl font-bold uppercase italic">Featured Cafes</h3>
                                    <span className="text-xs font-bold opacity-50 cursor-pointer hover:opacity-100">VIEW ALL →</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {cafeData.map(cf => (
                                        <div key={cf.no} className={`group cursor-pointer border-b ${theme.borderDotted} pb-8`}>
                                            <div className={`aspect-[16/9] mb-6 overflow-hidden relative border ${theme.borderDotted} rounded-lg bg-zinc-500/10`}>
                                                <span className={`absolute top-4 left-4 text-3xl font-black opacity-30 italic ${theme.textMuted} z-20 pointer-events-none`}>{cf.no}</span>
                                                <iframe
                                                    src={cf.mapSrc}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 0 }}
                                                    allowFullScreen={false}
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    className="relative z-10"
                                                ></iframe>
                                            </div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-lg font-bold group-hover:underline underline-offset-4">{cf.n}</h4>
                                                    <p className={`text-xs opacity-50 mt-1 ${theme.textMuted}`}>{cf.a}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {cf.tag.map(t => <span key={t} className={`text-[9px] opacity-40 ${theme.textMuted}`}>{t}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-8 pt-10">
                                    <h3 className={`text-xl font-bold uppercase italic border-b ${theme.borderDotted} pb-4`}>Latest Articles</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="space-y-4 group cursor-pointer">
                                                <div className={`aspect-video ${theme.cardBg} overflow-hidden rounded`}>
                                                    <div className="w-full h-full bg-zinc-500/20 group-hover:scale-110 transition-transform duration-700"></div>
                                                </div>
                                                <p className={`text-[10px] opacity-50 ${theme.textMuted}`}>2024.05.24 / Diary</p>
                                                <h5 className="text-xs font-bold leading-relaxed">都会の喧騒を離れて見つけた、静かすぎる喫茶店 3選</h5>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`mt-32 pt-20 border-t ${theme.borderDotted} w-full`}>
                            <h3 className="text-xl font-bold uppercase mb-10 italic">My Favorite List</h3>
                            <div className="flex gap-10 overflow-x-auto pb-10">
                                {['茶亭 羽當', 'カフェ・ド・ランブル', 'ライオン', '琥珀', '珈琲 タイム'].map(n => (
                                    <div key={n} className="shrink-0 w-40 space-y-4 group cursor-pointer">
                                        <div className={`aspect-[3/4] ${theme.cardBg} group-hover:ring-1 ${theme.border} transition-all rounded`}></div>
                                        <p className="text-[10px] font-bold text-center uppercase tracking-widest">{n}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;