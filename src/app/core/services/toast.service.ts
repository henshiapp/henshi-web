import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ToastService extends MessageService {
    private readonly LIFE_IN_MS = 3000; 

    success(message: string) {
        this.add({
            severity: 'success',
            summary: message,
            life: this.LIFE_IN_MS
        })
    }

    error(message: string, error?: string) {
      this.add({
            severity: 'success',
            summary: message,
            detail: error,
            life: this.LIFE_IN_MS
        })
    }
}