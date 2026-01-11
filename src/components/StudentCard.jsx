import { useState } from 'react';
import {
    User,
    Calendar,
    ChevronDown,
    ChevronUp,
    Trash2,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react';
import DetailRow from './DetailRow';

const StudentCard = ({ student, getStatusColor, getStatusIcon, onEdit, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    const colorClass = getStatusColor(student.estado);

    return (
        <div className={`bg-white rounded-xl shadow-sm border-l-8 overflow-hidden transition-all duration-300 ${colorClass.replace('bg-', 'border-').split(' ')[1]}`}>
            {/* Card Header (Always Visible) */}
            <div className="p-4 flex justify-between items-start cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-lg text-gray-800">{student.nombre}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${colorClass}`}>
                            {student.estado === 'proceso' ? 'En Proceso' : student.estado === 'apoyo' ? 'Req. Apoyo' : 'Avances'}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {student.edadGrado}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {student.fecha}</span>
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center pl-2">
                    {getStatusIcon(student.estado)}
                    {expanded ? <ChevronUp className="w-5 h-5 text-gray-400 mt-2" /> : <ChevronDown className="w-5 h-5 text-gray-400 mt-2" />}
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="px-4 pb-4 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-2">
                    <div className="grid gap-4 mt-4 text-sm">

                        <DetailRow label="Área de Refuerzo" content={student.areaRefuerzo} />
                        <DetailRow label="Diagnóstico Inicial" content={student.diagnostico} />
                        <DetailRow label="Objetivos" content={student.objetivos} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="bg-green-50 p-2 rounded border border-green-100">
                                <span className="font-bold text-green-800 block mb-1">Fortalezas</span>
                                <p className="text-gray-700">{student.fortalezas || '-'}</p>
                            </div>
                            <div className="bg-red-50 p-2 rounded border border-red-100">
                                <span className="font-bold text-red-800 block mb-1">Dificultades</span>
                                <p className="text-gray-700">{student.dificultades || '-'}</p>
                            </div>
                        </div>

                        <DetailRow label="Estrategias" content={student.estrategias} />
                        <DetailRow label="Avances Observados" content={student.avances} />
                        <DetailRow label="Observaciones" content={student.observaciones} />

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(student.id); }}
                                className="text-red-500 flex items-center gap-1 text-sm font-medium hover:bg-red-50 px-3 py-2 rounded transition-colors"
                            >
                                <Trash2 className="w-4 h-4" /> Eliminar
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(student); }}
                                className="bg-orange-600 text-white flex items-center gap-1 text-sm font-medium px-4 py-2 rounded shadow hover:bg-orange-700 transition-colors"
                            >
                                Editar Ficha
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentCard;
