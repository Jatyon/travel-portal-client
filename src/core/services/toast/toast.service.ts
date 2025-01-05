import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private readonly toastrService: ToastrService) {}

  show(message?: string, title?: string, override?: Partial<IndividualConfig>, type?: string): ActiveToast<any> {
    return this.toastrService.show(message, title, override, type);
  }

  success(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any> {
    return this.toastrService.success(message, title, override);
  }

  error(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any> {
    return this.toastrService.error(message, title, override);
  }

  info(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any> {
    return this.toastrService.info(message, title, override);
  }

  warning(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any> {
    return this.toastrService.warning(message, title, override);
  }

  clear(toastId?: number): void {
    this.toastrService.clear(toastId);
  }

  remove(toastId: number): boolean {
    return this.toastrService.remove(toastId);
  }

  validation(error: HttpErrorResponse): void {
    if (typeof error.error.message == 'string') {
      this.warning(error.error.message);
    } else {
      const messages = [];

      for (const field in error.error.message) {
        for (const contraint in error.error.message[field]) {
          messages.push(error.error.message[field][contraint]);
        }
      }

      this.warning(messages.join('<br>'), '', {
        enableHtml: true,
      });
    }
  }
}
