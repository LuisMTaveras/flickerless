export interface Invoice {
  id: string;
  number: string;
  client: string;
  clientRnc: string;
  ncf: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  itbis: number;
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
    issueDate: '2026-10-01',
    dueDate: '2026-10-25',
    subtotal: 156355.93,
    itbis: 28144.07,
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
    issueDate: '2026-10-03',
    dueDate: '2026-10-28',
    subtotal: 78305.51,
    itbis: 14094.99,
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
    issueDate: '2026-10-05',
    dueDate: '2026-11-02',
    subtotal: 381355.93,
    itbis: 68644.07,
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
    issueDate: '2026-09-28',
    dueDate: '2026-10-15',
    subtotal: 57533.90,
    itbis: 10356.10,
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
    issueDate: '2026-09-30',
    dueDate: '2026-10-20',
    subtotal: 28983.05,
    itbis: 5216.95,
    total: 34200.00,
    balance: 0.00,
    status: 'Anulada',
  },
  {
    id: '6',
    number: 'FAC-2026-006',
    client: 'Distribuidora Corripio & Asociados',
    clientRnc: '101-02394-1',
    ncf: 'E31000000050',
    issueDate: '2026-10-02',
    dueDate: '2026-10-31',
    subtotal: 215000.00,
    itbis: 38700.00,
    total: 253700.00,
    balance: 0.00,
    status: 'Emitida',
  },
  {
    id: '7',
    number: 'FAC-2026-007',
    client: 'Cervecería & Licores del Este',
    clientRnc: '130-99881-7',
    ncf: 'E31000000051',
    issueDate: '2026-10-04',
    dueDate: '2026-11-05',
    subtotal: 112000.00,
    itbis: 20160.00,
    total: 132160.00,
    balance: 132160.00,
    status: 'Emitida',
  },
  {
    id: '8',
    number: 'FAC-2026-008',
    client: 'Telecomunicaciones Quisqueya',
    clientRnc: '101-55443-2',
    ncf: 'E31000000052',
    issueDate: '2026-10-05',
    dueDate: '2026-11-10',
    subtotal: 42500.00,
    itbis: 7650.00,
    total: 50150.00,
    balance: 50150.00,
    status: 'Borrador',
  },
];

