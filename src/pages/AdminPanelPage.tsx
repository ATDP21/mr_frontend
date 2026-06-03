import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPanelPage() {
    return (
        <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Panel de administración</h1>

            <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
                <Link to="/admin/pedidos">
                    <button
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            textAlign: 'left',
                        }}
                    >
                        Ver todos los pedidos
                    </button>
                </Link>

                <Link to="/guitarra/crear">
                    <button
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            textAlign: 'left',
                        }}
                    >
                        Crear guitarra
                    </button>
                </Link>
            </div>
        </div>
    );
}