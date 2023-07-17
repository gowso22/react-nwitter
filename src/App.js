import { useEffect, useState } from "react";
import AppRouter from "./components/AppRouters";
import authService from "./fireBase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // userObj!
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {

      if(user){
        setIsLoggedIn(true);
        setUserObj(user);

      }else{
        setIsLoggedIn(false);
      }

      setInit(true);
    })
  }, [])

 // authService.currentUser >> user의 정보나 null 값을 반환, 로그인여부 판단
 // console.log(authService.currentUser);

  // userObj를 새로고침하는 기능
  const refreshUser = () => {
    const user = authService.currentUser;


    // authService.currentUser 내용의 덩치가 너무 큼
    // authService.currentUser의 일부만 가져와서 설정 해보자.
    setUserObj({
      displayName : user.displayName,
      uid : user.uid,
      updateProfile : (args) => user.updateProfile(args),
    })
  }

  return (
    <div>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn = {isLoggedIn} userObj = {userObj}/> : "시작하는 중..."}
      <footer>
        &copy; Nweetter
      </footer>
    </div>
  );
}

export default App;
