import * as React from 'react';
import { StatefulEvent, Releaseable } from 'mo-core';
import * as ios from './ios';
import * as android from './android';
export declare enum InterfaceOrientation {
    PORTRAIT = "portrait",
    LANDSCAPELEFT = "landscapeLeft",
    LANDSCAPERIGHT = "landscapeRight"
}
export declare type AllowedOrientations = Set<InterfaceOrientation>;
export declare const AllowedOrientationsAny: AllowedOrientations;
export declare const AllowedOrientationsPortrait: AllowedOrientations;
export declare const AllowedOrientationsLandscape: AllowedOrientations;
export declare class Orientation {
    static readonly ios: typeof ios;
    static readonly android: typeof android;
    static readonly PORTRAIT = InterfaceOrientation.PORTRAIT;
    static readonly LANDSCAPELEFT = InterfaceOrientation.LANDSCAPELEFT;
    static readonly LANDSCAPERIGHT = InterfaceOrientation.LANDSCAPERIGHT;
    static readonly interfaceOrientation: StatefulEvent<InterfaceOrientation>;
    static setAllowedOrientations(orientations: AllowedOrientations): void;
    private static allowedOrientationsStack;
    static pushAllowedOrientations(orientations: AllowedOrientations): Releaseable;
}
export interface OrientationConsumerProps {
    children: (orientation: Orientation) => React.ReactElement;
}
export declare class OrientationConsumer extends React.PureComponent<OrientationConsumerProps, {
    orientation: Orientation;
}> {
    state: {
        orientation: InterfaceOrientation;
    };
    private subscription?;
    constructor(props: OrientationConsumerProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
}
export interface OrientationInjectedProps {
    orientation: Orientation;
}
export declare function withOrientation<Props extends OrientationInjectedProps>(component: React.ComponentType<Props>): (React.ComponentType<Omit<Props, keyof OrientationInjectedProps>>);
export declare function withOrientationDecorator<Props extends OrientationInjectedProps, ComponentType extends React.ComponentType<Props>>(component: ComponentType & React.ComponentType<Props>): (ComponentType & (new (props: Omit<Props, keyof OrientationInjectedProps>, context?: any) => React.Component<Omit<Props, keyof OrientationInjectedProps>>));
export declare class OrientationLock extends React.PureComponent<{
    allowed: AllowedOrientations | 'portrait' | 'landscape' | 'any' | Orientation[];
}> {
    private lock?;
    private resolveAllowed;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: OrientationLock['props']): void;
    render(): null;
}
