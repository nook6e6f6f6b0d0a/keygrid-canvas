import streamDeck from "@elgato/streamdeck";
import { CanvasAction } from "./canvas-action.js";

streamDeck.actions.registerAction(new CanvasAction());
await streamDeck.connect();
