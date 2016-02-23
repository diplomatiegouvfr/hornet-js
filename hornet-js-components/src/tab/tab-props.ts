"use strict";

import React = require("react");

export interface TabProps extends React.Props<any> {
    /** Titre de l'onglet (affiché dans la barre d'onglets) */
    title?: string;
    tabId?: string;
    panelId?: string;
    isVisible?: boolean;
    forceRender?: boolean;
}

export interface TabsProps extends React.Props<any> {
    tabId?: string;
    panelId?: string;
    selectedTabIndex?: number;
    title?: string;
}




