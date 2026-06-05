import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-manuel-romero-blanco.png";

const HomePage: React.FC = () => {
    return (
        <section className="w-full p-[0px]">
            <div
                className="w-screen h-[700px] bg-[url('https://blog.musicopolix.com/wp-content/webp-express/webp-images/uploads/2021/02/ejercicios-para-agilizar-los-dedos-para-tocar-la-guitarra-portadas.jpg.webp')] bg-cover bg-no-repeat bg-center flex flex-col justify-center items-center p-[0px] ">
                <div className={"bg-black/50  flex flex-col justify-center items-center size-3xl"}>
                    <img src={logo} alt={"Manuel Romero Artesania"} className=" mx-auto   size-full p-10 opacity-100 "/>
                </div>


            </div>
            <section className="py-16 bg-gray-100" id="features">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-rwanda-blue">Inyungu za SomaRwanda</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                            <div
                                className="w-12 h-12 rounded-full bg-blue-100 text-rwanda-blue flex items-center justify-center mb-4">
                                <i className="fas fa-robot text-xl"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-2">AI Tutor w'Igice cy'Ubuvanganzo</h3>
                            <p className="text-gray-600 mb-4">
                                Ubufasha bwa AI bushingiye ku icyongereza, Ikinyarwanda, n'izindi ndimi zikoreshwa mu
                                Rwanda, bukora mu buryo bwo kwigana n'abanyeshuri.
                            </p>
                            <div className="flex items-center text-sm text-green-600">
                                <i className="fas fa-check-circle mr-2"></i>
                                <span>Igisubizo cyihariye ku banyeshuri bose :cite[2]:cite[8]</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                            <div
                                className="w-12 h-12 rounded-full bg-yellow-100 text-rwanda-yellow flex items-center justify-center mb-4">
                                <i className="fas fa-mobile-alt text-xl"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Gukoresha utagira Internet</h3>
                            <p className="text-gray-600 mb-4">
                                Koresha SMS, WhatsApp, cyangwa app yo ku mudasobwa utagira interinet kugirango ukomeze
                                kwiga aho uko ari ho hose.
                            </p>
                            <div className="flex items-center text-sm text-green-600">
                                <i className="fas fa-check-circle mr-2"></i>
                                <span>Yemewe ku turere dutagira interinet :cite[6]</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                            <div
                                className="w-12 h-12 rounded-full bg-green-100 text-rwanda-blue flex items-center justify-center mb-4">
                                <i className="fas fa-book text-xl"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Amasomo yihuje n'intego z'Uburezi</h3>
                            <p className="text-gray-600 mb-4">
                                Amasomo yose ahuriza hamwe n'intego z'Uburezi mu Rwanda (REB), akaziba igice cy'amasomo
                                y'ishuri.
                            </p>
                            <div className="flex items-center text-sm text-green-600">
                                <i className="fas fa-check-circle mr-2"></i>
                                <span>Igenderewe abanyeshuri kuva P1 kugeza S6 :cite[10]</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </section>

    );
};

export default HomePage;

