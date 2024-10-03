export class ApiResponse {
  private data: object | null;
  private message: string;
  private success: boolean;
  private status: number;
  constructor(data: object | null, message: string, status: number) {
    this.data = data;
    this.status = status;
    this.message = message;
    this.success = status < 400;
  }
}
