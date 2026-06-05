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
                    <h2 className="text-3xl font-bold text-center mb-12 text-rwanda-blue">Una familia en la que puedes confiar</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                            <div
                                className="w-12 h-12 rounded-full bg-blue-100 text-rwanda-blue flex items-center justify-center mb-4">
                                <i className="fas fa-robot text-xl"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Siempre presentes</h3>
                            <p className="text-gray-600 mb-4">
                                Nos tendrás siempre a tu lado, listos para ayudarte a resolver tus dudas,
                                aconsejarte e informarte tanto durante la compra de tu primera guitarra artesanal como en el mantenimiento y su perfecto estado.
                            </p>
                            <div className="flex items-center text-sm text-green-600">
                                <i className="fas fa-check-circle mr-2"></i>
                                <span>En la página de contacto tendrás todos los medios de comunicación a nuestra mano</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                            <div
                                className="w-12 h-12 rounded-full bg-yellow-100 text-rwanda-yellow flex items-center justify-center mb-4">
                                <i className="fas fa-mobile-alt text-xl"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Pronto vienen muestras</h3>
                            <p className="text-gray-600 mb-4">
                                Nuestra carpinteria siempre está abierta para aquel que quiera conocer nuestro taller, pero si os coge lejos
                                tenemos planeado subir los videos de nuestras mejores guitarras, a manos de los mejores artistas.
                            </p>
                            <div className="flex items-center text-sm text-green-600">
                                <i className="fas fa-check-circle mr-2"></i>
                                <span>No os alejéis demasiado que vienen novedades</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                            <div
                                className="w-12 h-12 rounded-full bg-green-100 text-rwanda-blue flex items-center justify-center mb-4">
                                <i className="fas fa-book text-xl"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-2">El arte de la artesanía</h3>
                            <p className="text-gray-600 mb-4">
                                Con tradición y cariño ponemos todo nuestro empeño en sacar las mejores guitarras posibles,
                                cada una promete un toque diferente y nuevo, personal y único. Cada guitarra tiene su carisma,
                                su sonoridad y su tacto, que solo las guitarras echas a mano pueden conseguir.
                            </p>
                            <div className="flex items-center text-sm text-green-600">
                                <i className="fas fa-check-circle mr-2"></i>
                                <span>Un toque sin igual, una personalidad en cada una de nuestras guitarras</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </section>

    );
};

export default HomePage;

