// src/pages/CarritoPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/cart/CartContext";
import { getGuitarraById } from "../modules/guitarras/services/guitarra.service";
import type { Guitarra } from "../modules/guitarras/types/guitarra";
import { apiFetch } from "../utils/api";
import { config } from "../config/enviroment";
import { useAuth } from "../contexts/auth/AuthContext";
import { getMisDirecciones, DireccionDTO, crearDireccion, DireccionCrearDTO, editarDireccion, eliminarDireccion } from '../modules/direcciones/address.service';
import {GuitarraImagen} from "../modules/guitarras/types/guitarraImagen";
import {getGuitarraImagenes, resolveGuitarraImagenUrl} from "../modules/guitarras/services/guitarraImagen.service";

type CartLine = {
    idProducto: number;
    quantity: number;
    guitarra: Guitarra | null;
    imagen: GuitarraImagen | null;
    loading: boolean;
    error: string | null;
};

const CarritoPage: React.FC = () => {
    const { items, totalItems, setQuantity, removeItem, clear } = useCart();
    const [loading, setLoading] = useState(true);

    const [lines, setLines] = useState<CartLine[]>([]);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            setLoading(true);

            try {
                const results: CartLine[] = await Promise.all(
                    items.map(async (it) => {
                        try {
                            const guitarra = await getGuitarraById(String(it.productId));
                            if (!guitarra) {
                                return {
                                    idProducto: it.productId,
                                    quantity: it.quantity,
                                    guitarra: null,
                                    imagen: null,
                                    loading: false,
                                    error: "No encontrada",
                                };
                            }
                            const imagenes = await getGuitarraImagenes(guitarra.id);
                            const imagenPrincipal = imagenes.find((img) => img.principal) ?? imagenes[0] ?? null;

                            return {
                                idProducto: it.productId,
                                quantity: it.quantity,
                                guitarra,
                                imagen: imagenPrincipal,
                                loading: false,
                                error: null,
                            };
                        } catch (e) {
                            return {
                                idProducto: it.productId,
                                quantity: it.quantity,
                                guitarra: null,
                                imagen: null,
                                loading: false,
                                error: e instanceof Error ? e.message : "Error al cargar",
                            };
                        }
                    })
                );

                if (!cancelled) setLines(results);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void run();

        return () => {
            cancelled = true;
        };
    }, [items]);

    const subtotal = useMemo(() => {
        return lines.reduce((acc, l) => {
            if (!l.guitarra) return acc;
            return acc + l.guitarra.precio * l.quantity;
        }, 0);
    }, [lines]);

    const { user } = useAuth();
    const [creating, setCreating] = useState(false);
    const [direcciones, setDirecciones] = useState<DireccionDTO[]>([]);
    const [loadingDirs, setLoadingDirs] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [creatingDir, setCreatingDir] = useState(false);
    const [newDir, setNewDir] = useState<DireccionCrearDTO>({
        nombreDestinatario: '',
        direccionCalle: '',
        codigoPostal: '',
        ciudad: '',
        provincia: '',
        pais: '',
        telefono: '',
        documentoId: '',
        tipoDireccion: 'PEDIDO'
    });
    const [selectedDelivery, setSelectedDelivery] = useState<number | null>(null);
    const [selectedBilling, setSelectedBilling] = useState<number | null>(null);
    const [expandedDelivery, setExpandedDelivery] = useState<Set<number>>(new Set());
    const [expandedBilling, setExpandedBilling] = useState<Set<number>>(new Set());
    const [showAddressSelector, setShowAddressSelector] = useState(false);
    const [editingDirId, setEditingDirId] = useState<number | null>(null);
    const [editDirData, setEditDirData] = useState<DireccionCrearDTO>({
        nombreDestinatario: '',
        direccionCalle: '',
        codigoPostal: '',
        ciudad: '',
        provincia: '',
        pais: '',
        telefono: '',
        documentoId: '',
        tipoDireccion: 'PEDIDO'
    });
    const [editingDirLoading, setEditingDirLoading] = useState(false);

    useEffect(() => { void (async () => {
        setLoadingDirs(true);
        try {
            const d = await getMisDirecciones();
            setDirecciones(d);
        } catch (err) {
            console.error('Error cargando direcciones', err);
        } finally {
            setLoadingDirs(false);
        }
    })(); }, []);

    // listas derivadas para mostrar mensajes si no existen direcciones
    const deliveryDirs = direcciones.filter(d => d.tipoDireccion === 'PEDIDO' || d.tipoDireccion === 'AMBAS');
    const billingDirs = direcciones.filter(d => d.tipoDireccion === 'FACTURACION' || d.tipoDireccion === 'AMBAS');

    const handleCreateDireccion = async () => {
        try {
            setCreatingDir(true);
            const created = await crearDireccion(newDir);
            setDirecciones(prev => [created, ...prev]);
            setShowAddForm(false);
            // reset
            setNewDir({
                nombreDestinatario: '',
                direccionCalle: '',
                codigoPostal: '',
                ciudad: '',
                provincia: '',
                pais: '',
                telefono: '',
                documentoId: '',
                tipoDireccion: 'PEDIDO'
            });
        } catch (e: any) {
            console.error('Error crear dirección', e);
            alert(e?.message || 'Error creando dirección');
        } finally {
            setCreatingDir(false);
        }
    };

    const handleStartEditDireccion = (dir: DireccionDTO) => {
        setEditingDirId(dir.id);
        setEditDirData({
            nombreDestinatario: dir.nombreDestinatario,
            direccionCalle: dir.direccionCalle,
            codigoPostal: dir.codigoPostal,
            ciudad: dir.ciudad,
            provincia: dir.provincia,
            pais: dir.pais,
            telefono: dir.telefono,
            documentoId: dir.documentoId,
            tipoDireccion: dir.tipoDireccion
        });
    };

    const handleSaveEditDireccion = async () => {
        if (!editingDirId) return;
        try {
            setEditingDirLoading(true);
            const updated = await editarDireccion(editingDirId, editDirData);
            setDirecciones(prev => prev.map(d => d.id === editingDirId ? updated : d));
            setEditingDirId(null);
        } catch (e: any) {
            console.error('Error editar dirección', e);
            alert(e?.message || 'Error editando dirección');
        } finally {
            setEditingDirLoading(false);
        }
    };

    const handleDeleteDireccion = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
            return;
        }
        try {
            await eliminarDireccion(id);
            setDirecciones(prev => prev.filter(d => d.id !== id));
            // Limpiar selecciones si era la seleccionada
            if (selectedDelivery === id) setSelectedDelivery(null);
            if (selectedBilling === id) setSelectedBilling(null);
        } catch (e: any) {
            console.error('Error eliminar dirección', e);
            alert(e?.message || 'Error eliminando dirección');
        }
    };

    const getAddressValidationError = (): string | null => {
        const delId = selectedDelivery;
        const billId = selectedBilling;
        const delDir = delId ? direcciones.find(d => d.id === delId) : null;
        const billDir = billId ? direcciones.find(d => d.id === billId) : null;

        if (!delId && !billId) {
            return 'Selecciona dirección de entrega y facturación';
        }
        if (!delId && billId && billDir?.tipoDireccion !== 'AMBAS') {
            return 'Selecciona dirección de entrega';
        }
        if (delId && !billId && delDir?.tipoDireccion !== 'AMBAS') {
            return 'Selecciona dirección de facturación';
        }
        return null;
    };

    const handleProceedToCheckout = async () => {
        if (items.length === 0) return;
        const validationError = getAddressValidationError();
        if (validationError) {
            setShowAddressSelector(true);
            return;
        }
        try {
            setCreating(true);

            // Si no hay entrega seleccionada, usar facturación si es AMBAS
            const delId = selectedDelivery ?? (selectedBilling && direcciones.find(d => d.id === selectedBilling)?.tipoDireccion === 'AMBAS' ? selectedBilling : null);
            // Si no hay facturación seleccionada, usar entrega si es AMBAS
            const billId = selectedBilling ?? (selectedDelivery && direcciones.find(d => d.id === selectedDelivery)?.tipoDireccion === 'AMBAS' ? selectedDelivery : null);

            const payload = {
                cartItems: items.map(it => ({ guitarraid: it.productId, cantidad: it.quantity })),
                direccionEntregaId: delId || 0,
                direccionFacturacionId: billId || 0,
                email: user?.email ?? '',
                nombreCliente: user?.nombreCompleto ?? user?.nomusuario ?? 'Cliente'
            };

            console.log('Checkout payload (obj):', payload);
            console.log('Checkout payload (json):', JSON.stringify(payload));

            const res = await apiFetch(`${config.url.API_BASE_URL}/api/checkout/create-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(body?.message || `Create session failed: ${res.status}`);
            }

            const body = await res.json().catch(() => null);
            if (body && body.sessionUrl) {
                // redirección top-level a Stripe
                window.location.assign(body.sessionUrl);
                return;
            }
            throw new Error('sessionUrl not returned by backend');
        } catch (e: any) {
            console.error('Error creating session', e);
            alert(e?.message || 'Error al crear la sesión');
        } finally {
            setCreating(false);
        }
    };

    // @ts-ignore
    return (
        <div className="bg-gray-100 h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-semibold mb-4">Carrito</h1>
                <Link to="/guitarra/stock">Seguir comprando</Link>
            </div>


            {items.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <>

                    <div className="flex flex-col ml-[70px] md:flex-row gap-4">
                        <div className="md:w-3/4">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                                <table className="w-full">
                                    <thead>
                                    <tr>
                                        <th className="text-left font-semibold">Detalles</th>
                                        <th className="text-left font-semibold">Producto</th>
                                        <th className="text-left font-semibold">Precio</th>
                                        <th className="text-left font-semibold">Cantidad</th>
                                        <th className="text-left font-semibold">Total</th>
                                        <th className="text-left font-semibold">Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody>


                                    {lines.map((l) => (
                                        <tr key={l.idProducto}>
                                            <Link to={`/guitarra/${encodeURIComponent(l.guitarra?.id || '')}`}>
                                                Ver guitarra
                                            </Link>
                                            <td className="py-4">
                                                <div className="flex items-center">
                                                    {l.imagen ? (
                                                        <img
                                                            className="h-16 w-16 mr-4 object-cover"
                                                            src={resolveGuitarraImagenUrl(l.imagen.rutaPublica)}
                                                            alt={l.guitarra?.nombre ?? "Guitarra"}
                                                        />
                                                    ) : (
                                                        <div className="h-16 w-16 mr-4 bg-gray-200 flex items-center justify-center text-xs">
                                                            Sin imagen
                                                        </div>
                                                    )}

                                                    <span className="font-semibold">{l.guitarra?.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">{l.guitarra ? `${l.guitarra.precio} €` : "—"}</td>
                                            <td className="py-4">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={l.quantity}
                                                    onChange={(e) => setQuantity(l.idProducto, Number(e.target.value || 1))}
                                                    style={{ width: 72 }}
                                                />
                                            </td>
                                            <td className="py-4">{l.guitarra ? `${l.guitarra.precio * l.quantity} €` : "—"}</td>
                                            <td>
                                                <button onClick={() => removeItem(l.idProducto)} disabled={l.loading}>
                                                    Quitar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="md:w-1/4">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                                <div className="flex justify-between mb-2">
                                    <span>Subtotal</span>
                                    <span>{subtotal} €</span>
                                </div>

                                <div className="flex justify-between mb-2">
                                    <span>Transporte</span>
                                    <span>0.00 €</span>
                                </div>
                                <hr className="my-2"/>
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-semibold">{subtotal}</span>
                                </div>
                                <button onClick={handleProceedToCheckout}
                                        disabled={creating || items.length === 0}
                                        className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
                                        style={{

                                            cursor: creating || items.length === 0 ? 'not-allowed' : 'pointer'
                                        }}
                                >
                                    {creating ? 'Creando sesión...' : 'Proceder al pago'}
                                </button>
                            </div>
                        </div>
                    </div>


                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: 16,
                                alignItems: 'center'
                            }}>
                            <div>
                                <button className={"ml-[50px]"} onClick={clear}>Vaciar carrito</button>
                            </div>
                            <div style={{textAlign: "right", minWidth: 260}}>



                                {showAddressSelector && (
                                    <div style={{
                                        marginTop: 16,
                                        border: '1px solid #ddd',
                                        padding: 12,
                                        borderRadius: 4
                                    }}>
                                        <div style={{marginBottom: 12}}>
                                            <button onClick={() => setShowAddForm(s => !s)}
                                                    style={{marginBottom: 8}}>{showAddForm ? 'Cancelar' : 'Añadir dirección'}</button>
                                        </div>
                                        {showAddForm && (
                                            <div style={{
                                                border: '1px solid #ddd',
                                                padding: 8,
                                                marginBottom: 12
                                            }}>
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr',
                                                    gap: 8
                                                }}>
                                                    <input placeholder="Nombre destinatario"
                                                           value={newDir.nombreDestinatario}
                                                           onChange={e => setNewDir({
                                                               ...newDir,
                                                               nombreDestinatario: e.target.value
                                                           })}/>
                                                    <input placeholder="Teléfono" value={newDir.telefono}
                                                           onChange={e => setNewDir({
                                                               ...newDir,
                                                               telefono: e.target.value
                                                           })}/>
                                                    <input placeholder="Calle" value={newDir.direccionCalle}
                                                           onChange={e => setNewDir({
                                                               ...newDir,
                                                               direccionCalle: e.target.value
                                                           })}/>
                                                    <input placeholder="Documento ID"
                                                           value={newDir.documentoId}
                                                           onChange={e => setNewDir({
                                                               ...newDir,
                                                               documentoId: e.target.value
                                                           })}/>
                                                    <input placeholder="Código postal"
                                                           value={newDir.codigoPostal}
                                                           onChange={e => setNewDir({
                                                               ...newDir,
                                                               codigoPostal: e.target.value
                                                           })}/>
                                                    <input placeholder="Ciudad" value={newDir.ciudad}
                                                           onChange={e => setNewDir({
                                                               ...newDir,
                                                               ciudad: e.target.value
                                                           })}/>
                                                    <input placeholder="Provincia" value={newDir.provincia}
                                                           onChange={e => setNewDir({
                                                               ...newDir,
                                                               provincia: e.target.value
                                                           })}/>
                                                    <input placeholder="País" value={newDir.pais}
                                                           onChange={e => setNewDir({
                                                               ...newDir,
                                                               pais: e.target.value
                                                           })}/>
                                                    <div style={{gridColumn: '1 / -1'}}>
                                                        <label>Tipo:&nbsp;</label>
                                                        <select value={newDir.tipoDireccion}
                                                                onChange={e => setNewDir({
                                                                    ...newDir,
                                                                    tipoDireccion: e.target.value as any
                                                                })}>
                                                            <option value="PEDIDO">PEDIDO</option>
                                                            <option value="FACTURACION">FACTURACION</option>
                                                            <option value="AMBAS">AMBAS</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div style={{marginTop: 8, display: 'flex', gap: 8}}>
                                                    <button onClick={handleCreateDireccion}
                                                            disabled={creatingDir}>{creatingDir ? 'Creando...' : 'Crear'}</button>
                                                    <button onClick={() => setShowAddForm(false)}
                                                            disabled={creatingDir}>Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <div style={{display: 'flex', gap: 16, alignItems: 'flex-start'}}>
                                            <div style={{flex: 1}}>
                                                <label style={{fontSize: 14, fontWeight: 600}}>Dirección de
                                                    entrega</label>
                                                {loadingDirs ? <div>Cargando direcciones...</div> : (
                                                    <div>
                                                        {deliveryDirs.length === 0 ? (
                                                            <div style={{
                                                                marginTop: 8,
                                                                fontSize: 13,
                                                                color: '#486bf1'
                                                            }}>No
                                                                tienes ninguna dirección de entrega. Crea
                                                                una dirección de
                                                                tipo PEDIDO o AMBAS.</div>
                                                        ) : (
                                                            deliveryDirs.map(d => {
                                                                const isExp = expandedDelivery.has(d.id);
                                                                const isEditing = editingDirId === d.id;
                                                                return (
                                                                    <div key={`del-${d.id}`} style={{
                                                                        marginBottom: 8,
                                                                        paddingBottom: 8,
                                                                        borderBottom: '1px solid #eee'
                                                                    }}>
                                                                        {isEditing ? (
                                                                            <div style={{
                                                                                border: '1px solid #ddd',
                                                                                padding: 8,
                                                                                marginBottom: 8
                                                                            }}>
                                                                                <div style={{
                                                                                    display: 'grid',
                                                                                    gridTemplateColumns: '1fr 1fr',
                                                                                    gap: 8
                                                                                }}>
                                                                                    <input
                                                                                        placeholder="Nombre destinatario"
                                                                                        value={editDirData.nombreDestinatario}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            nombreDestinatario: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="Teléfono"
                                                                                        value={editDirData.telefono}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            telefono: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="Calle"
                                                                                        value={editDirData.direccionCalle}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            direccionCalle: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="Documento ID"
                                                                                        value={editDirData.documentoId}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            documentoId: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="Código postal"
                                                                                        value={editDirData.codigoPostal}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            codigoPostal: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="Ciudad"
                                                                                        value={editDirData.ciudad}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            ciudad: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="Provincia"
                                                                                        value={editDirData.provincia}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            provincia: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="País"
                                                                                        value={editDirData.pais}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            pais: e.target.value
                                                                                        })}/>
                                                                                    <div
                                                                                        style={{gridColumn: '1 / -1'}}>
                                                                                        <label>Tipo:&nbsp;</label>
                                                                                        <select
                                                                                            value={editDirData.tipoDireccion}
                                                                                            onChange={e => setEditDirData({
                                                                                                ...editDirData,
                                                                                                tipoDireccion: e.target.value as any
                                                                                            })}>
                                                                                            <option
                                                                                                value="PEDIDO">PEDIDO
                                                                                            </option>
                                                                                            <option
                                                                                                value="FACTURACION">FACTURACION
                                                                                            </option>
                                                                                            <option
                                                                                                value="AMBAS">AMBAS
                                                                                            </option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{
                                                                                    marginTop: 8,
                                                                                    display: 'flex',
                                                                                    gap: 8
                                                                                }}>
                                                                                    <button
                                                                                        onClick={handleSaveEditDireccion}
                                                                                        disabled={editingDirLoading}>{editingDirLoading ? 'Guardando...' : 'Guardar'}</button>
                                                                                    <button
                                                                                        onClick={() => setEditingDirId(null)}
                                                                                        disabled={editingDirLoading}>Cancelar
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <div style={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: 8
                                                                                }}>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const s = new Set(expandedDelivery);
                                                                                            if (s.has(d.id)) s.delete(d.id);
                                                                                            else s.add(d.id);
                                                                                            setExpandedDelivery(s);
                                                                                        }}
                                                                                        style={{
                                                                                            padding: '2px 6px',
                                                                                            fontSize: 12,
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                    >
                                                                                        {isExp ? '−' : '+'}
                                                                                    </button>
                                                                                    <input type="radio"
                                                                                           name="delivery"
                                                                                           checked={selectedDelivery === d.id}
                                                                                           onChange={() => {
                                                                                               setSelectedDelivery(d.id);
                                                                                               if (d.tipoDireccion === 'AMBAS') setSelectedBilling(null);
                                                                                           }}
                                                                                           disabled={selectedBilling !== null && direcciones.find(b => b.id === selectedBilling)?.tipoDireccion === 'AMBAS'}/>
                                                                                    <label style={{
                                                                                        flex: 1,
                                                                                        cursor: 'pointer',
                                                                                        marginBottom: 0
                                                                                    }}>
                                                                                        {d.nombreDestinatario} — {d.direccionCalle} ({d.tipoDireccion})
                                                                                    </label>
                                                                                    <button
                                                                                        onClick={() => handleStartEditDireccion(d)}
                                                                                        style={{
                                                                                            padding: '2px 6px',
                                                                                            fontSize: 12
                                                                                        }}>Editar
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => handleDeleteDireccion(d.id)}
                                                                                        style={{
                                                                                            padding: '2px 6px',
                                                                                            fontSize: 12,
                                                                                            backgroundColor: '#ee1818',
                                                                                            color: 'white'
                                                                                        }}>Eliminar
                                                                                    </button>
                                                                                </div>
                                                                                {isExp && (
                                                                                    <div style={{
                                                                                        marginTop: 6,
                                                                                        paddingLeft: 28,
                                                                                        fontSize: 12,
                                                                                        lineHeight: 1.6
                                                                                    }}>
                                                                                        <div>
                                                                                            <strong>Calle:</strong> {d.direccionCalle}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>CP:</strong> {d.codigoPostal}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>Ciudad:</strong> {d.ciudad}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>Provincia:</strong> {d.provincia}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>País:</strong> {d.pais}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>Teléfono:</strong> {d.telefono}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>Documento:</strong> {d.documentoId}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{flex: 1}}>
                                                <label style={{fontSize: 14, fontWeight: 600}}>Dirección de
                                                    facturación</label>
                                                {loadingDirs ? <div>Cargando direcciones...</div> : (
                                                    <div>
                                                        {billingDirs.length === 0 ? (
                                                            <div style={{
                                                                marginTop: 8,
                                                                fontSize: 13,
                                                                color: '#486bf1'
                                                            }}>No
                                                                tienes ninguna dirección de facturación.
                                                                Crea una dirección
                                                                de tipo FACTURACION o AMBAS.</div>
                                                        ) : (
                                                            billingDirs.map(d => {
                                                                const isExp = expandedBilling.has(d.id);
                                                                const isEditing = editingDirId === d.id;
                                                                return (
                                                                    <div key={`bill-${d.id}`} style={{
                                                                        marginBottom: 8,
                                                                        paddingBottom: 8,
                                                                        borderBottom: '1px solid #eee'
                                                                    }}>
                                                                        {isEditing ? (
                                                                            <div style={{
                                                                                border: '1px solid #ddd',
                                                                                padding: 8,
                                                                                marginBottom: 8
                                                                            }}>
                                                                                <div style={{
                                                                                    display: 'grid',
                                                                                    gridTemplateColumns: '1fr 1fr',
                                                                                    gap: 8
                                                                                }}>
                                                                                    <input
                                                                                        placeholder="Nombre destinatario"
                                                                                        value={editDirData.nombreDestinatario}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            nombreDestinatario: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="Teléfono"
                                                                                        value={editDirData.telefono}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            telefono: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="Calle"
                                                                                        value={editDirData.direccionCalle}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            direccionCalle: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="Documento ID"
                                                                                        value={editDirData.documentoId}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            documentoId: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="Código postal"
                                                                                        value={editDirData.codigoPostal}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            codigoPostal: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="Ciudad"
                                                                                        value={editDirData.ciudad}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            ciudad: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="Provincia"
                                                                                        value={editDirData.provincia}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            provincia: e.target.value
                                                                                        })}/>
                                                                                    <input
                                                                                        placeholder="País"
                                                                                        value={editDirData.pais}
                                                                                        onChange={e => setEditDirData({
                                                                                            ...editDirData,
                                                                                            pais: e.target.value
                                                                                        })}/>
                                                                                    <div
                                                                                        style={{gridColumn: '1 / -1'}}>
                                                                                        <label>Tipo:&nbsp;</label>
                                                                                        <select
                                                                                            value={editDirData.tipoDireccion}
                                                                                            onChange={e => setEditDirData({
                                                                                                ...editDirData,
                                                                                                tipoDireccion: e.target.value as any
                                                                                            })}>
                                                                                            <option
                                                                                                value="PEDIDO">PEDIDO
                                                                                            </option>
                                                                                            <option
                                                                                                value="FACTURACION">FACTURACION
                                                                                            </option>
                                                                                            <option
                                                                                                value="AMBAS">AMBAS
                                                                                            </option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{
                                                                                    marginTop: 8,
                                                                                    display: 'flex',
                                                                                    gap: 8
                                                                                }}>
                                                                                    <button
                                                                                        onClick={handleSaveEditDireccion}
                                                                                        disabled={editingDirLoading}>{editingDirLoading ? 'Guardando...' : 'Guardar'}</button>
                                                                                    <button
                                                                                        onClick={() => setEditingDirId(null)}
                                                                                        disabled={editingDirLoading}>Cancelar
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <div style={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: 8
                                                                                }}>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const s = new Set(expandedBilling);
                                                                                            if (s.has(d.id)) s.delete(d.id);
                                                                                            else s.add(d.id);
                                                                                            setExpandedBilling(s);
                                                                                        }}
                                                                                        style={{
                                                                                            padding: '2px 6px',
                                                                                            fontSize: 12,
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                    >
                                                                                        {isExp ? '−' : '+'}
                                                                                    </button>
                                                                                    <input type="radio"
                                                                                           name="billing"
                                                                                           checked={selectedBilling === d.id}
                                                                                           onChange={() => {
                                                                                               setSelectedBilling(d.id);
                                                                                               if (d.tipoDireccion === 'AMBAS') setSelectedDelivery(null);
                                                                                           }}
                                                                                           disabled={selectedDelivery !== null && direcciones.find(s => s.id === selectedDelivery)?.tipoDireccion === 'AMBAS'}/>
                                                                                    <label style={{
                                                                                        flex: 1,
                                                                                        cursor: 'pointer',
                                                                                        marginBottom: 0
                                                                                    }}>
                                                                                        {d.nombreDestinatario} — {d.direccionCalle} ({d.tipoDireccion})
                                                                                    </label>
                                                                                    <button
                                                                                        onClick={() => handleStartEditDireccion(d)}
                                                                                        style={{
                                                                                            padding: '2px 6px',
                                                                                            fontSize: 12
                                                                                        }}>Editar
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => handleDeleteDireccion(d.id)}
                                                                                        style={{
                                                                                            padding: '2px 6px',
                                                                                            fontSize: 12,
                                                                                            backgroundColor: '#ec101f',
                                                                                            color: 'white'
                                                                                        }}>Eliminar
                                                                                    </button>
                                                                                </div>
                                                                                {isExp && (
                                                                                    <div style={{
                                                                                        marginTop: 6,
                                                                                        paddingLeft: 28,
                                                                                        fontSize: 12,
                                                                                        lineHeight: 1.6
                                                                                    }}>
                                                                                        <div>
                                                                                            <strong>Calle:</strong> {d.direccionCalle}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>CP:</strong> {d.codigoPostal}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>Ciudad:</strong> {d.ciudad}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>Provincia:</strong> {d.provincia}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>País:</strong> {d.pais}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>Teléfono:</strong> {d.telefono}
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>Documento:</strong> {d.documentoId}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                    )}
                </div>
            );
            };

            export default CarritoPage;
