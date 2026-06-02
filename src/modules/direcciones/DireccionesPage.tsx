import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getMisDirecciones,
  crearDireccion,
  editarDireccion,
  eliminarDireccion,
  DireccionDTO,
  DireccionCrearDTO,
  TipoDireccion
} from './address.service';

function emptyForm(): DireccionCrearDTO {
  return {
    nombreDestinatario: '',
    direccionCalle: '',
    codigoPostal: '',
    ciudad: '',
    provincia: '',
    pais: '',
    telefono: '',
    documentoId: '',
    tipoDireccion: 'PEDIDO'
  };
}

const DireccionesPage: React.FC = () => {
  const [direcciones, setDirecciones] = useState<DireccionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<DireccionDTO | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DireccionCrearDTO>(emptyForm());
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMisDirecciones();
      setDirecciones(data);
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes('401') || err.message.includes('Unauthorized') || err.message.includes('403'))) {
        navigate('/login');
        return;
      }
      setError(err?.message || 'Error al cargar direcciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    void (async () => { await load(); })();
  }, []);

  const onNew = () => { setForm(emptyForm()); setEditing(null); setShowForm(true); };

  const onEdit = (d: DireccionDTO) => {
    setEditing(d);
    setForm({
      nombreDestinatario: d.nombreDestinatario,
      direccionCalle: d.direccionCalle,
      codigoPostal: d.codigoPostal,
      ciudad: d.ciudad,
      provincia: d.provincia,
      pais: d.pais,
      telefono: d.telefono,
      documentoId: d.documentoId,
      tipoDireccion: d.tipoDireccion as TipoDireccion
    });
    setShowForm(true);
  };

  const onDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar dirección?')) return;
    try {
      await eliminarDireccion(id);
      await load();
    } catch (err: any) {
      alert(err?.message || 'Error al eliminar');
    }
  };

  const validateForm = (f: DireccionCrearDTO) => {
    if (!f.nombreDestinatario || !f.direccionCalle || !f.codigoPostal || !f.ciudad || !f.pais) return false;
    if (!['PEDIDO','FACTURACION','AMBAS'].includes(f.tipoDireccion)) return false;
    return true;
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateForm(form)) { alert('Rellena los campos obligatorios'); return; }
    try {
      if (editing) {
        await editarDireccion(editing.id, form);
      } else {
        await crearDireccion(form);
      }
      setShowForm(false);
      await load();
    } catch (err: any) {
      alert(err?.message || 'Error al guardar');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <h2>Mis direcciones</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={onNew} className="btn btn-primary">Nueva dirección</button>
      </div>

      {loading && <p>Cargando direcciones...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && direcciones.length === 0 && <p>No tienes direcciones guardadas.</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Destinatario</th>
            <th>Dirección</th>
            <th>Tipo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {direcciones.map(d => (
            <tr key={d.id}>
              <td>{d.nombreDestinatario}<br/><small>{d.telefono}</small></td>
              <td>{d.direccionCalle}, {d.codigoPostal} {d.ciudad} ({d.provincia})</td>
              <td>{d.tipoDireccion}</td>
              <td>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(d)}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" style={{ marginLeft: 8 }} onClick={() => onDelete(d.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div style={{ marginTop: 20, border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
          <h4>{editing ? 'Editar dirección' : 'Nueva dirección'}</h4>
          <form onSubmit={submit}>
            <div className="mb-2">
              <label>Nombre destinatario*</label>
              <input className="form-control" value={form.nombreDestinatario} onChange={e => setForm({...form, nombreDestinatario: e.target.value})} />
            </div>
            <div className="mb-2">
              <label>Calle*</label>
              <input className="form-control" value={form.direccionCalle} onChange={e => setForm({...form, direccionCalle: e.target.value})} />
            </div>
            <div className="row">
              <div className="col">
                <label>CP*</label>
                <input className="form-control" value={form.codigoPostal} onChange={e => setForm({...form, codigoPostal: e.target.value})} />
              </div>
              <div className="col">
                <label>Ciudad*</label>
                <input className="form-control" value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})} />
              </div>
            </div>
            <div className="mb-2">
              <label>Provincia</label>
              <input className="form-control" value={form.provincia} onChange={e => setForm({...form, provincia: e.target.value})} />
            </div>
            <div className="mb-2">
              <label>Pais*</label>
              <input className="form-control" value={form.pais} onChange={e => setForm({...form, pais: e.target.value})} />
            </div>
            <div className="mb-2">
              <label>Telefono</label>
              <input className="form-control" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
            </div>
            <div className="mb-2">
              <label>Documento</label>
              <input className="form-control" value={form.documentoId} onChange={e => setForm({...form, documentoId: e.target.value})} />
            </div>
            <div className="mb-2">
              <label>Tipo*</label>
              <select className="form-control" value={form.tipoDireccion} onChange={e => setForm({...form, tipoDireccion: e.target.value as TipoDireccion})}>
                <option value="PEDIDO">PEDIDO</option>
                <option value="FACTURACION">FACTURACION</option>
                <option value="AMBAS">AMBAS</option>
              </select>
            </div>
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-primary" type="submit">Guardar</button>
              <button type="button" className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default DireccionesPage;


