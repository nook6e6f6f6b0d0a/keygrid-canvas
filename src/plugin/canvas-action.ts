import {
  action,
  SingletonAction,
  type KeyDownEvent,
  type WillAppearEvent,
  type WillDisappearEvent
} from "@elgato/streamdeck";
import { CanvasEngine, layoutFromDeviceSize, type ButtonLayout } from "../display/index.js";
import {
  GalleryRenderer,
  nextScene,
  sceneTargetFps,
  type GalleryScene
} from "../renderers/gallery-renderer.js";
import { CANVAS_TILE_ACTION_UUID } from "./constants.js";
import { StreamDeckButtonPresenter } from "./stream-deck-button-presenter.js";

type CanvasTileSettings = {
  readonly scene?: GalleryScene;
};

type DeviceRuntime = {
  readonly layout: ButtonLayout;
  readonly presenter: StreamDeckButtonPresenter;
  readonly engine: CanvasEngine;
  renderer: GalleryRenderer;
  scene: GalleryScene;
};

@action({ UUID: CANVAS_TILE_ACTION_UUID })
export class CanvasAction extends SingletonAction<CanvasTileSettings> {
  private readonly runtimes = new Map<string, DeviceRuntime>();

  override onWillAppear(ev: WillAppearEvent<CanvasTileSettings>): void {
    if (!ev.action.isKey() || ev.action.isInMultiAction()) {
      return;
    }

    const runtime = this.ensureRuntime(
      ev.action.device.id,
      ev.action.device.name,
      ev.action.device.size,
      ev.payload.settings.scene
    );
    runtime.presenter.add(ev.action);
    void ev.action.setSettings({ scene: runtime.scene });
    runtime.engine.invalidate();
    runtime.engine.start();
    void runtime.engine.renderOnce();
  }

  override onWillDisappear(ev: WillDisappearEvent<CanvasTileSettings>): void {
    const runtime = this.runtimes.get(ev.action.device.id);
    runtime?.presenter.removeById(ev.action.id);
    if (runtime?.presenter.visibleCount === 0) {
      runtime.engine.stop();
    }
  }

  override async onKeyDown(ev: KeyDownEvent<CanvasTileSettings>): Promise<void> {
    if (!ev.action.isKey()) {
      return;
    }
    const runtime = this.runtimes.get(ev.action.device.id);
    if (!runtime) {
      return;
    }

    runtime.scene = nextScene(runtime.scene);
    runtime.renderer = new GalleryRenderer(runtime.scene);
    runtime.engine.setRenderer(runtime.renderer);
    runtime.engine.setTargetFps(sceneTargetFps(runtime.scene));
    await runtime.presenter.setSettingsForVisible({ scene: runtime.scene });
    await runtime.engine.renderOnce();
  }

  private ensureRuntime(
    deviceId: string,
    deviceName: string,
    size: { columns: number; rows: number },
    requestedScene?: GalleryScene
  ): DeviceRuntime {
    const existing = this.runtimes.get(deviceId);
    if (existing) {
      return existing;
    }

    const scene = requestedScene ?? "signal";
    const layout = layoutFromDeviceSize(deviceId, deviceName, size);
    const renderer = new GalleryRenderer(scene);
    const keyCount = size.columns * size.rows;
    const presenter = new StreamDeckButtonPresenter(keyCount > 15 ? 1 : 2, keyCount > 15 ? 35 : 20);
    const engine = new CanvasEngine({
      layout,
      renderer,
      presenter,
      targetFps: sceneTargetFps(scene)
    });
    const runtime = { layout, presenter, engine, renderer, scene };
    this.runtimes.set(deviceId, runtime);
    return runtime;
  }
}
