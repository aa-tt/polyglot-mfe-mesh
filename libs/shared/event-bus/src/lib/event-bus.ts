import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * The State Mesh Event Bus.
 * 
 * Provides a version-agnostic communication bridge between Micro-frontends.
 * Uses RxJS internally to provide reactive patterns (filtering, mapping, backpressure).
 */
export interface MfeEvent<T = any> {
  type: string;
  payload: T;
  meta: {
    source: string;
    timestamp: number;
    version: string;
  };
}

class EventBus {
  private static instance: EventBus;
  private bus$ = new Subject<MfeEvent>();

  private constructor() {
    // Hidden singleton to ensure single bus across the MFE mesh
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
      // Attach to window to bridge across different bundles/React versions
      (window as any).__MFE_EVENT_BUS__ = EventBus.instance;
    }
    return (window as any).__MFE_EVENT_BUS__ || EventBus.instance;
  }

  /**
   * Publish an event to the mesh.
   */
  public publish<T>(type: string, payload: T, source: string) {
    this.bus$.next({
      type,
      payload,
      meta: {
        source,
        timestamp: Date.now(),
        version: '1.0.0',
      },
    });
  }

  /**
   * Subscribe to specific event types.
   */
  public on<T>(type: string): Observable<T> {
    return this.bus$.asObservable().pipe(
      filter((e) => e.type === type),
      map((e) => e.payload as T)
    );
  }

  /**
   * Access the raw stream for advanced reactive operations (buffer, throttle, etc.)
   */
  public stream(): Observable<MfeEvent> {
    return this.bus$.asObservable();
  }
}

export const mfeBus = EventBus.getInstance();

