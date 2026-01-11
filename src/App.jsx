import { useState, useEffect, useRef } from 'react';
import {
    Save,
    User,
    BookOpen,
    Heart,
    Target,
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    Calendar,
    Plus,
    Trash2,
    Search,
    FileText,
    LayoutGrid,
    Table as TableIcon,
    Edit,
    Download,
    Upload,
    Menu,
    X
} from 'lucide-react';
import StudentCard from './components/StudentCard';
import TextAreaField from './components/TextAreaField';

export default function App() {
    const [students, setStudents] = useState(() => {
        const saved = localStorage.getItem('studentsData');
        if (saved) {
            return JSON.parse(saved);
        }
        // --- ALUMNO DE MUESTRA: ANDRÉS ---
        return [{
            id: 1715432100000,
            nombre: 'Andrés',
            edadGrado: '7 años / 2º B',
            areaRefuerzo: 'Habilidades Sociales y Control de Impulsos',
            diagnostico: 'TDAH con predominio impulsivo',
            objetivos: 'Mejorar la tolerancia a la frustración y respetar el espacio personal de sus compañeros.',
            fortalezas: 'Es muy cariñoso, siempre busca ayudar a los demás y tiene una gran empatía. Muy creativo dibujando.',
            dificultades: 'Le cuesta permanecer sentado en asamblea y a veces interrumpe por entusiasmo excesivo.',
            estrategias: 'Roles de ayudante de clase (para canalizar su energía), pausas activas cada 20 min y refuerzo positivo inmediato.',
            avances: 'Ha logrado esperar su turno para hablar en 3 de 5 ocasiones esta semana.',
            observaciones: 'Su actitud cariñosa lo hace muy querido en el grupo, aunque a veces invade el espacio físico de otros al abrazar.',
            fecha: new Date().toISOString().split('T')[0],
            estado: 'proceso'
        }];
    });

    const [view, setView] = useState('list'); // 'list' or 'form'
    const [listLayout, setListLayout] = useState('cards'); // 'cards' or 'table'
    const [searchTerm, setSearchTerm] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const fileInputRef = useRef(null);

    // Initial Form State
    const initialFormState = {
        id: null,
        nombre: '',
        edadGrado: '',
        areaRefuerzo: '',
        diagnostico: '',
        objetivos: '',
        fortalezas: '',
        dificultades: '',
        estrategias: '',
        avances: '',
        observaciones: '',
        fecha: new Date().toISOString().split('T')[0],
        estado: 'proceso' // avances, proceso, apoyo
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        localStorage.setItem('studentsData', JSON.stringify(students));
    }, [students]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.id) {
            // Update existing
            setStudents(students.map(s => s.id === formData.id ? formData : s));
        } else {
            // Create new
            setStudents([...students, { ...formData, id: Date.now() }]);
        }
        setFormData(initialFormState);
        setView('list');
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este registro?')) {
            setStudents(students.filter(s => s.id !== id));
        }
    };

    const handleEdit = (student) => {
        setFormData(student);
        setView('form');
    };

    // EXPORT DATA
    const handleExport = () => {
        const dataStr = JSON.stringify(students, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `educontrol_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setShowMenu(false);
    };

    // IMPORT DATA
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (Array.isArray(importedData)) {
                    if (window.confirm(`¿Importar ${importedData.length} estudiantes? Esto reemplazará los datos actuales.`)) {
                        setStudents(importedData);
                        alert('Datos importados exitosamente!');
                    }
                } else {
                    alert('El archivo no tiene el formato correcto.');
                }
            } catch (error) {
                alert('Error al leer el archivo. Asegúrate de que sea un archivo JSON válido.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
        setShowMenu(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'avances': return 'bg-green-100 border-green-500 text-green-800';
            case 'proceso': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
            case 'apoyo': return 'bg-red-100 border-red-500 text-red-800';
            default: return 'bg-gray-100 border-gray-300 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'avances': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'proceso': return <Clock className="w-5 h-5 text-yellow-600" />;
            case 'apoyo': return <AlertCircle className="w-5 h-5 text-red-600" />;
            default: return <Activity className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'avances': return 'Avances';
            case 'proceso': return 'En Proceso';
            case 'apoyo': return 'Req. Apoyo';
            default: return 'Desconocido';
        }
    };

    const filteredStudents = students.filter(student =>
        student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.diagnostico.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-orange-50/30 font-sans text-slate-800 pb-20">
            {/* Header */}
            <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 shadow-lg sticky top-0 z-20">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Heart className="w-6 h-6" fill="white" />
                            Ángeles de Corazón
                        </h1>
                        <p className="text-orange-100 text-xs mt-0.5">App de Control Educativo</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {view === 'list' && (
                            <>
                                <button
                                    onClick={() => { setFormData(initialFormState); setView('form'); }}
                                    className="bg-white text-orange-600 px-3 py-2 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nuevo</span>
                                </button>

                                {/* Menu Button */}
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="bg-white/20 p-2 rounded-full active:scale-95 transition-transform"
                                >
                                    {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </>
                        )}
                        {view === 'form' && (
                            <button
                                onClick={() => setView('list')}
                                className="text-white text-sm underline opacity-90"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>

                {/* Dropdown Menu */}
                {showMenu && (
                    <div className="absolute right-4 top-16 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2">
                        <button
                            onClick={handleExport}
                            className="w-full px-4 py-3 text-left text-gray-700 hover:bg-orange-50 flex items-center gap-3 transition-colors"
                        >
                            <Download className="w-5 h-5 text-orange-600" />
                            <div>
                                <div className="font-medium">Exportar Datos</div>
                                <div className="text-xs text-gray-400">Descargar backup JSON</div>
                            </div>
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full px-4 py-3 text-left text-gray-700 hover:bg-orange-50 flex items-center gap-3 transition-colors border-t border-gray-100"
                        >
                            <Upload className="w-5 h-5 text-blue-600" />
                            <div>
                                <div className="font-medium">Importar Datos</div>
                                <div className="text-xs text-gray-400">Cargar archivo JSON</div>
                            </div>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="hidden"
                        />
                    </div>
                )}
            </header>

            {/* Click outside to close menu */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                />
            )}

            <main className="max-w-6xl mx-auto p-4">

                {/* VIEW: LIST */}
                {view === 'list' && (
                    <div className="space-y-4">

                        {/* Controls: Search and Layout Toggle */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center sticky top-[72px] z-10 bg-orange-50/95 py-2 -mx-4 px-4 backdrop-blur-sm">
                            <div className="relative flex-1 sm:max-w-xs">
                                <input
                                    type="text"
                                    placeholder="Buscar estudiante..."
                                    className="w-full p-2.5 pl-10 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-orange-400 outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            </div>

                            <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex gap-1">
                                <button
                                    onClick={() => setListLayout('cards')}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${listLayout === 'cards' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <LayoutGrid className="w-4 h-4" /> Tarjetas
                                </button>
                                <button
                                    onClick={() => setListLayout('table')}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${listLayout === 'table' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <TableIcon className="w-4 h-4" /> Tabla
                                </button>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                                <div className="text-lg font-bold text-green-700">{students.filter(s => s.estado === 'avances').length}</div>
                                <div className="text-xs text-green-600">Avances</div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
                                <div className="text-lg font-bold text-yellow-700">{students.filter(s => s.estado === 'proceso').length}</div>
                                <div className="text-xs text-yellow-600">En Proceso</div>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                                <div className="text-lg font-bold text-red-700">{students.filter(s => s.estado === 'apoyo').length}</div>
                                <div className="text-xs text-red-600">Req. Apoyo</div>
                            </div>
                        </div>

                        {/* Empty State */}
                        {students.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>No hay estudiantes registrados.</p>
                                <p className="text-sm">Presiona "Nuevo" para comenzar.</p>
                            </div>
                        )}

                        {/* CONTENT: CARDS Layout */}
                        {listLayout === 'cards' && (
                            <div className="grid gap-4 max-w-3xl mx-auto">
                                {filteredStudents.map(student => (
                                    <StudentCard
                                        key={student.id}
                                        student={student}
                                        getStatusColor={getStatusColor}
                                        getStatusIcon={getStatusIcon}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}

                        {/* CONTENT: TABLE Layout */}
                        {listLayout === 'table' && filteredStudents.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                            <tr>
                                                <th className="p-4 min-w-[200px]">Estudiante / Diagnóstico</th>
                                                <th className="p-4 min-w-[120px]">Estado</th>
                                                <th className="p-4 min-w-[250px] hidden md:table-cell">Objetivos y Estrategias</th>
                                                <th className="p-4 min-w-[250px] hidden lg:table-cell">Avances y Observaciones</th>
                                                <th className="p-4 w-[100px] text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredStudents.map(student => {
                                                const statusColor = getStatusColor(student.estado);
                                                const rowBg = statusColor.includes('green') ? 'bg-green-50/30' :
                                                    statusColor.includes('yellow') ? 'bg-yellow-50/30' :
                                                        statusColor.includes('red') ? 'bg-red-50/30' : 'bg-white';

                                                return (
                                                    <tr key={student.id} className={`hover:bg-gray-50 transition-colors ${rowBg}`}>
                                                        <td className="p-4 align-top">
                                                            <div className="font-bold text-gray-900 text-base">{student.nombre}</div>
                                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                                <User className="w-3 h-3" /> {student.edadGrado}
                                                            </div>
                                                            <div className="mt-2 text-xs font-medium text-gray-600 bg-white/50 p-1.5 rounded border border-gray-100">
                                                                <span className="text-gray-400 block text-[10px] uppercase">Diagnóstico</span>
                                                                {student.diagnostico || 'Sin diagnóstico'}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-top">
                                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                                                                {getStatusIcon(student.estado)}
                                                                {getStatusLabel(student.estado)}
                                                            </div>
                                                            <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" /> {student.fecha}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-top space-y-2 hidden md:table-cell">
                                                            {student.objetivos && (
                                                                <div>
                                                                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">Objetivos</span>
                                                                    <p className="text-gray-700 line-clamp-3 hover:line-clamp-none transition-all cursor-help" title={student.objetivos}>{student.objetivos}</p>
                                                                </div>
                                                            )}
                                                            {student.estrategias && (
                                                                <div>
                                                                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">Estrategias</span>
                                                                    <p className="text-gray-700 line-clamp-3 hover:line-clamp-none transition-all cursor-help" title={student.estrategias}>{student.estrategias}</p>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="p-4 align-top space-y-2 hidden lg:table-cell">
                                                            {student.avances && (
                                                                <div>
                                                                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Avances</span>
                                                                    <p className="text-gray-700 line-clamp-3 hover:line-clamp-none transition-all cursor-help" title={student.avances}>{student.avances}</p>
                                                                </div>
                                                            )}
                                                            {student.observaciones && (
                                                                <div>
                                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Obs.</span>
                                                                    <p className="text-gray-500 italic line-clamp-2 hover:line-clamp-none transition-all" title={student.observaciones}>{student.observaciones}</p>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="p-4 align-top text-center">
                                                            <div className="flex flex-col gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(student)}
                                                                    className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors flex items-center justify-center gap-1 text-xs font-medium"
                                                                >
                                                                    <Edit className="w-4 h-4" /> Editar
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(student.id)}
                                                                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-1 text-xs font-medium"
                                                                >
                                                                    <Trash2 className="w-4 h-4" /> Borrar
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* VIEW: FORM */}
                {view === 'form' && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 max-w-3xl mx-auto">
                        <div className="p-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
                            <h2 className="font-bold text-lg">
                                {formData.id ? 'Editar Registro' : 'Nuevo Seguimiento'}
                            </h2>
                            <p className="text-orange-100 text-sm">Complete los campos del estudiante</p>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Sección: Datos Básicos */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-600">Nombre del Estudiante</label>
                                <input required name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none transition-colors" placeholder="Ej. Juan Pérez" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Edad o Grado</label>
                                    <input name="edadGrado" value={formData.edadGrado} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" placeholder="Ej. 8 años / 2º" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Fecha Seguimiento</label>
                                    <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" />
                                </div>
                            </div>

                            {/* Sección: Estado (El semáforo) */}
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                                <label className="block text-sm font-bold text-orange-800 mb-2">Estado General / Semáforo</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button type="button" onClick={() => setFormData({ ...formData, estado: 'avances' })} className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all border-2 ${formData.estado === 'avances' ? 'bg-green-100 border-green-500 text-green-800 scale-105 shadow-sm' : 'bg-white border-transparent text-gray-400'}`}>
                                        <CheckCircle className="w-6 h-6" />
                                        <span className="text-xs font-bold">Avances</span>
                                    </button>
                                    <button type="button" onClick={() => setFormData({ ...formData, estado: 'proceso' })} className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all border-2 ${formData.estado === 'proceso' ? 'bg-yellow-100 border-yellow-500 text-yellow-800 scale-105 shadow-sm' : 'bg-white border-transparent text-gray-400'}`}>
                                        <Clock className="w-6 h-6" />
                                        <span className="text-xs font-bold">En Proceso</span>
                                    </button>
                                    <button type="button" onClick={() => setFormData({ ...formData, estado: 'apoyo' })} className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all border-2 ${formData.estado === 'apoyo' ? 'bg-red-100 border-red-500 text-red-800 scale-105 shadow-sm' : 'bg-white border-transparent text-gray-400'}`}>
                                        <AlertCircle className="w-6 h-6" />
                                        <span className="text-xs font-bold">Req. Apoyo</span>
                                    </button>
                                </div>
                            </div>

                            {/* Campos de texto extenso */}
                            <TextAreaField icon={<Target className="w-4 h-4" />} label="Área(s) que refuerza" name="areaRefuerzo" value={formData.areaRefuerzo} onChange={handleInputChange} />
                            <TextAreaField icon={<Activity className="w-4 h-4" />} label="Diagnóstico Inicial" name="diagnostico" value={formData.diagnostico} onChange={handleInputChange} />
                            <TextAreaField icon={<Target className="w-4 h-4" />} label="Objetivos del trabajo" name="objetivos" value={formData.objetivos} onChange={handleInputChange} />

                            <div className="grid sm:grid-cols-2 gap-4">
                                <TextAreaField icon={<CheckCircle className="w-4 h-4 text-green-500" />} label="Fortalezas" name="fortalezas" value={formData.fortalezas} onChange={handleInputChange} />
                                <TextAreaField icon={<AlertCircle className="w-4 h-4 text-red-500" />} label="Dificultades" name="dificultades" value={formData.dificultades} onChange={handleInputChange} />
                            </div>

                            <TextAreaField icon={<BookOpen className="w-4 h-4" />} label="Estrategias aplicadas" name="estrategias" value={formData.estrategias} onChange={handleInputChange} />
                            <TextAreaField icon={<Activity className="w-4 h-4" />} label="Avances observados" name="avances" value={formData.avances} onChange={handleInputChange} />
                            <TextAreaField icon={<FileText className="w-4 h-4" />} label="Observaciones Generales" name="observaciones" value={formData.observaciones} onChange={handleInputChange} />

                        </div>

                        <div className="p-4 bg-gray-50 border-t flex gap-3">
                            <button type="button" onClick={() => setView('list')} className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg shadow-md hover:from-orange-700 hover:to-orange-600 active:scale-95 transition-all flex justify-center items-center gap-2">
                                <Save className="w-5 h-5" /> Guardar Ficha
                            </button>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}
