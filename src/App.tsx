import { useState } from 'react';
import MuseumExperience from './museum/MuseumExperience';
import ProfilePage from './ProfilePage';

// 3D螺旋ミュージアム（メイン体験）と従来のプロフィールページを切り替えられる
function App() {
  const [classicView, setClassicView] = useState(false);

  const toggleView = () => {
    window.scrollTo(0, 0);
    setClassicView(v => !v);
  };

  return (
    <>
      {classicView ? <ProfilePage /> : <MuseumExperience />}
      <button className="view-toggle" onClick={toggleView}>
        {classicView ? '3D MUSEUM →' : 'CLASSIC VIEW →'}
      </button>
    </>
  );
}

export default App;
