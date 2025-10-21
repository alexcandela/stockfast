import { Injectable, ApplicationRef, createComponent, EnvironmentInjector, ComponentRef } from '@angular/core';
import { NotificationCard } from '../../components/notification-card/notification-card';

export interface NotificationConfig {
  type: 'success' | 'info' | 'error' | 'warning';
  label: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: ComponentRef<NotificationCard>[] = [];
  private container: HTMLElement | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {
    this.createContainer();
  }

  private createContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.style.position = 'fixed';
      this.container.style.bottom = '0';
      this.container.style.right = '0';
      this.container.style.zIndex = '10000';
      this.container.style.pointerEvents = 'none';
      document.body.appendChild(this.container);
    }
  }

  show(config: NotificationConfig) {
    const duration = config.duration || 3000;
    
    const componentRef = createComponent(NotificationCard, {
      environmentInjector: this.injector
    });

    componentRef.setInput('type', config.type);
    componentRef.setInput('label', config.label);

    this.appRef.attachView(componentRef.hostView);
    
    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    domElem.style.pointerEvents = 'auto';
    
    this.createContainer();
    this.container!.appendChild(domElem);

    this.notifications.push(componentRef);
    this.updatePositions();

    setTimeout(() => {
      this.remove(componentRef);
    }, duration);

    return componentRef;
  }

  private remove(componentRef: ComponentRef<NotificationCard>) {
    const index = this.notifications.indexOf(componentRef);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }

    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
    
    this.updatePositions();
  }

  private updatePositions() {
    this.notifications.forEach((notification, index) => {
      const domElem = (notification.hostView as any).rootNodes[0] as HTMLElement;
      domElem.style.bottom = `${20 + (index * 90)}px`;
    });
  }

  success(label: string, duration?: number) {
    return this.show({ type: 'success', label, duration });
  }

  error(label: string, duration?: number) {
    return this.show({ type: 'error', label, duration });
  }

  info(label: string, duration?: number) {
    return this.show({ type: 'info', label, duration });
  }

  warning(label: string, duration?: number) {
    return this.show({ type: 'warning', label, duration });
  }
}