export interface EventPublisher {
  publishCompleted(event: {
    appointmentId: string;
    insuredId: string;
    status: "COMPLETED";
  }): Promise<void>;
}
