export interface Invoice {
  id: string;
  number: string;
  client: string;
  clientRnc: string;
  ncf: string;
  dueDate: string;
  total: number;
  balance: number;
  status: 'Emitida' | 'Borrador' | 'Rechazada DGII' | 'Anulada';
}

export const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    number: 'FAC-2026-001',
    client: 'Acme Dominicana SRL',
    clientRnc: '131-45678-9',
    ncf: 'E31000000045',
    dueDate: '2026-10-25',
    total: 184500.00,
    balance: 0.00,
    status: 'Emitida',
  },
  {
    id: '2',
    number: 'FAC-2026-002',
    client: 'Soluciones Tecnológicas del Caribe',
    clientRnc: '101-98765-2',
    ncf: 'E31000000046',
    dueDate: '2026-10-28',
    total: 92400.50,
    balance: 92400.50,
    status: 'Emitida',
  },
  {
    id: '3',
    number: 'FAC-2026-003',
    client: 'Grupo Inmobiliario Punta Cana',
    clientRnc: '130-11223-4',
    ncf: 'E31000000047',
    dueDate: '2026-11-02',
    total: 450000.00,
    balance: 150000.00,
    status: 'Borrador',
  },
  {
    id: '4',
    number: 'FAC-2026-004',
    client: 'Constructora Santo Domingo SAS',
    clientRnc: '102-33445-8',
    ncf: 'E31000000048',
    dueDate: '2026-10-15',
    total: 67890.00,
    balance: 67890.00,
    status: 'Rechazada DGII',
  },
  {
    id: '5',
    number: 'FAC-2026-005',
    client: 'Logística & Envíos Cibao',
    clientRnc: '132-88776-1',
    ncf: 'E31000000049',
    dueDate: '2026-10-20',
    total: 34200.00,
    balance: 0.00,
    status: 'Anulada',
  },
];
