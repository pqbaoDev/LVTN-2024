import Header from "../components/Header/Header";
import Routers from "../routes/Routers";
import LeftSideBar from "../components/Header/leftSideBar";

const Layout = () => {
    return (
        <div className="flex flex-1">
            <div className="flex-none h-screen">
                <LeftSideBar />

            </div>
            <main className="flex flex-col h-screen w-full">
                <div className="flex-1">
                    <Header />

                    <Routers />
                </div>
            </main>
        </div>
    );
}

export default Layout;
