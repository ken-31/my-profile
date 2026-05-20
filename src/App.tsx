// 1. 新しく作った ProfilePage.tsx を読み込みます（インポート）
import ProfilePage from './ProfilePage';

// 2. App という名前のメイン部品（コンポーネント）を作ります
function App() {
  return (
    // 3. 読み込んだ ProfilePage を画面に表示します
    <ProfilePage />
  );
}

// 4. この App を外から使えるように書き出します（エクスポート）
export default App;