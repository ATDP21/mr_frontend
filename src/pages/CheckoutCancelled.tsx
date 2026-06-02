import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutCancelled: React.FC = () => {
  return (
	<div className="container mt-5">
	  <div className="alert alert-warning text-center">
		<h4>Pago cancelado</h4>
		<p>Has cancelado el proceso de pago. Puedes volver al carrito para intentarlo de nuevo.</p>
		<Link to="/carrito" className="btn btn-primary mt-3">Volver al carrito</Link>
	  </div>
	</div>
  );
};

export default CheckoutCancelled;

