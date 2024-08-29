
import Header from "../components/Header/Header";
import Footers from "../components/Footer/Footers";
import Routers from "../routes/Routers";
import LeftSideBar from "../components/Header/leftSideBar";

const Layout = () => {
    return (
        <div className="flex flex-col h-screen">
            <header className="flex-none bg-gray-200 p-4">
                <Header />
            </header>
            <main className="flex flex-grow bg-white ">
                <div className="w-1/5 bg-gray-100 ">
                    <LeftSideBar />
                </div>
                <div className="w-4/5 ">
                    <Routers />
                </div>
            </main>
            <footer className="flex-none bg-gray-200 p-4">
                <Footers />
            </footer>
        </div>
    );
}

export default Layout;
