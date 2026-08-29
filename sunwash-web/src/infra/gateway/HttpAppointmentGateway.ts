import type { Appointment, AppointmentStatus } from '../../domain/Appointment';
import type {
  AppointmentGateway,
  ReportExportFilters,
  AppointmentListFilters,
  AppointmentListResult,
  CreateAppointmentInput,
} from '../../application/gateway/AppointmentGateway';
import { api, isNotFound, numericId } from '../http/api';

const buildReportExportParams = (filters: ReportExportFilters = {}): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.client) params.set('client', filters.client);
  if (filters.address) params.set('address', filters.address);
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);
  if (filters.status) params.set('status', filters.status);

  return params;
};

const readReportExportErrorMessage = async (data: unknown): Promise<string | null> => {
  if (!(typeof Blob !== 'undefined' && data instanceof Blob)) {
    return null;
  }

  const text = await data.text();
  if (!text) return null;

  try {
    const parsed = JSON.parse(text) as { message?: string; error?: string };
    return parsed.message || parsed.error || text;
  } catch {
    return text;
  }
};

export class HttpAppointmentGateway implements AppointmentGateway {
  async create(input: CreateAppointmentInput): Promise<Appointment> {
    const response = await api.post<Appointment>('/appointments', {
      userId: input.userId ? numericId(input.userId) : undefined,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      address: input.address,
      scheduledDate: new Date(input.dateTime).toISOString(),
      panelsCount: input.panelsCount,
      roofPhotoUrl: input.roofPhotoUrl,
      notes: input.notes,
    });
    return response.data;
  }

  async findById(id: string): Promise<Appointment | null> {
    try {
      const response = await api.get<Appointment>(`/appointments/${numericId(id)}`);
      return response.data;
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async listByUser(userId: string): Promise<Appointment[]> {
    const response = await api.get<Appointment[]>('/appointments/me', {
      params: { userId: numericId(userId) },
    });
    return response.data;
  }

  async listAll(filters?: AppointmentListFilters): Promise<AppointmentListResult> {
    const response = await api.get<AppointmentListResult>('/appointments', {
      params: filters,
    });
    return response.data;
  }

  async exportReport(filters?: ReportExportFilters): Promise<Blob> {
    try {
      const response = await api.get<Blob>('/reports/export', {
        params: buildReportExportParams(filters),
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const responseData = (
        error as Error & {
          responseData?: unknown;
          response?: { data?: unknown; status?: number };
          status?: number;
          message?: string;
        }
      ).responseData ?? (
        error as { response?: { data?: unknown } }
      ).response?.data;
      const parsedMessage = await readReportExportErrorMessage(responseData);
      const status = (
        error as Error & { status?: number; response?: { status?: number } }
      ).status ?? (
        error as { response?: { status?: number } }
      ).response?.status;
      const message = parsedMessage
        || ((error instanceof Error && error.message) ? error.message : null)
        || 'Não foi possível exportar o relatório.';
      const reportError = new Error(message) as Error & { status?: number };
      reportError.status = status;
      throw reportError;
    }
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const response = await api.patch<Appointment>(`/appointments/${numericId(id)}/status`, { status });
    return response.data;
  }

  async uploadDronePhotos(id: string, droneBeforePhotoUrl: string, droneAfterPhotoUrl: string): Promise<Appointment> {
    const response = await api.post<Appointment>(`/appointments/${numericId(id)}/drone-photos`, {
      droneBeforePhotoUrl,
      droneAfterPhotoUrl,
    });
    return response.data;
  }
}
