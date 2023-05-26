import type { NextPage } from "next";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ApproveComponent from "../components/approve-component";

const Approve = () => {
    return (
        <>
            <Navbar></Navbar>

            <ApproveComponent></ApproveComponent>

            <Footer></Footer>
        </>
    );
};

export default Approve;
