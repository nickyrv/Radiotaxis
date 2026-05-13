

export const mockAlerts = [
  {
    id: '1',
    title: 'SOAT próximo a vencer',
    description: 'El SOAT del vehículo LP-1234 vence en 7 días.',
    type: 'document',
    severity: 'high',
    date: '2026-05-20'
  },
  {
    id: '2',
    title: 'Mantenimiento programado',
    description: 'El vehículo LP-5678 requiere mantenimiento.',
    type: 'maintenance',
    severity: 'medium',
    date: '2026-05-25'
  },
  {
    id: '3',
    title: 'Pago pendiente',
    description: 'Existe un pago pendiente del conductor Juan Pérez.',
    type: 'payment',
    severity: 'low',
    date: '2026-05-28'
  }
];
export const mockProfitabilityData = [
  { month: 'Jul', historical: 10000, predicted: 10200 },
  { month: 'Ago', historical: 12000, predicted: 12300 },
  { month: 'Sep', historical: 15000, predicted: 15500 },
  { month: 'Oct', historical: 17000, predicted: 18000 },
  { month: 'Nov', historical: 19000, predicted: 20000 },
  { month: 'Dic', historical: 22000, predicted: 23000 }
];

export const mockDailyEarnings = [
  { day: 'Lun', amount: 700 },
  { day: 'Mar', amount: 850 },
  { day: 'Mié', amount: 920 },
  { day: 'Jue', amount: 760 },
  { day: 'Vie', amount: 980 },
  { day: 'Sáb', amount: 1100 }
];

export const mockOwners = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    ci: '1234567',
    phone: '77777777',
    email: 'carlos@gmail.com',
    address: 'La Paz',
    status: 'active',

    vehicleIds: ['1'],
    joinDate: '2024-01-10'
  },

  {
    id: '2',
    name: 'Ana Flores',
    ci: '7654321',
    phone: '78888888',
    email: 'ana@gmail.com',
    address: 'El Alto',
    status: 'active',

    vehicleIds: ['2'],
    joinDate: '2024-02-15'
  }
];

export const mockVehicles = [
  {
    id: '1',
    plate: '1234-ABC',
    model: 'Toyota Corolla',
    year: 2020,
    ownerId: '1',
    status: 'active',
    nextMaintenance: '2026-06-15',
    documentExpiry: '2026-12-20'
  },
  {
    id: '2',
    plate: '5678-XYZ',
    model: 'Suzuki Dzire',
    year: 2022,
    ownerId: '2',
    status: 'maintenance',
    nextMaintenance: '2026-05-30',
    documentExpiry: '2026-11-10'
  }
];

export const mockDrivers = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    license: 'LIC-12345',
    phone: '77711122',
    email: 'carlos@radiotaxi.com',
    vehicleId: '1',
    status: 'active',
    licenseExpiry: '2026-12-20'
  },
  {
    id: '2',
    name: 'José Vargas',
    license: 'LIC-54321',
    phone: '77733344',
    email: 'jose@radiotaxi.com',
    vehicleId: '2',
    status: 'blocked',
    licenseExpiry: '2026-10-15'
  }
];

export const mockShifts = [
  {
    id: '1',
    driverId: '1',
    vehicleId: '1',
    startTime: '08:00',
    endTime: '16:00',
    status: 'active'
  },

  {
    id: '2',
    driverId: '2',
    vehicleId: '2',
    startTime: '16:00',
    endTime: '00:00',
    status: 'pending'
  }
];

export const mockIncidents = [
  {
    id: '1',
    driverId: '1',
    type: 'failure',
    description: 'Falla en frenos',
    status: 'pending',
    date: '2026-05-12'
  },

  {
    id: '2',
    driverId: '1',
    type: 'accident',
    description: 'Choque leve',
    status: 'resolved',
    date: '2026-05-09'
  }
];

export const mockPayments = [
  {
    id: '1',
    driverId: '1',
    amount: 150,
    concept: 'Entrega diaria',
    date: '2026-05-13',
    type: 'daily'
  },

  {
    id: '2',
    driverId: '1',
    amount: 900,
    concept: 'Entrega semanal',
    date: '2026-05-10',
    type: 'weekly'
  }
];