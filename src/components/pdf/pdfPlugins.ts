import { createPluginRegistration } from "@embedpdf/core";
import { DocumentManagerPluginPackage } from "@embedpdf/plugin-document-manager/react";
import { InteractionManagerPluginPackage } from "@embedpdf/plugin-interaction-manager/react";
import { RenderPluginPackage } from "@embedpdf/plugin-render/react";
import { ScrollPluginPackage } from "@embedpdf/plugin-scroll/react";
import { SelectionPluginPackage } from "@embedpdf/plugin-selection/react";
import { ViewportPluginPackage } from "@embedpdf/plugin-viewport/react";
import { ZoomPluginPackage, ZoomMode } from "@embedpdf/plugin-zoom";

export const pdfPlugins = [
  createPluginRegistration(DocumentManagerPluginPackage),
  createPluginRegistration(ViewportPluginPackage),
  createPluginRegistration(ScrollPluginPackage),
  createPluginRegistration(RenderPluginPackage),
  createPluginRegistration(InteractionManagerPluginPackage),
  createPluginRegistration(SelectionPluginPackage, {
    menuHeight: 36, // Height of the custom selection menu, used for above/below placement.
  }),
  createPluginRegistration(ZoomPluginPackage, {
    defaultZoomLevel: ZoomMode.FitPage, // You can pass options here!
  }),
];
