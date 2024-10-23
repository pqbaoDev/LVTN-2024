// import Header from "../components/Header/Header";
import Routers from "../routes/Routers";
import LeftSideBar from "../components/Header/leftSideBar";

const Layout = () => {
    return (
        <div className="flex flex-1">
            <div className="flex-none">
                <LeftSideBar />

            </div>
            <main className=" h-screen w-full">
               
                    <Routers />
                
            </main>
        </div>
    );
}

export default Layout;
