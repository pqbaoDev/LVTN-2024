// import Header from "../components/Header/Header";
import Routers from "../routes/Routers";
import LeftSideBar from "../components/Header/leftSideBar";
import Header from "../components/Header/Header";

const Layout = () => {
    return (
        <div className="flex flex-1">
            <div className="flex-none">
                <LeftSideBar />

            </div>
            <main className=" h-screen w-full ml-52">
            <Header />

               
                    <Routers />
                
            </main>
        </div>
    );
}

export default Layout;
