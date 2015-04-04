// Type definitions for Kendo UI

declare module kendo {
    function bind(selector: string, viewModel: any, namespace?: any): void;
    function bind(element: JQuery, viewModel: any, namespace?: any): void;
    function bind(element: Element, viewModel: any, namespace?: any): void;
    function culture(value: string): void;
    function culture(): {
        name: string;
        calendar: {
            AM: string[];
            PM: string[];
            days: {
                names: string[];
                namesAbbr: string[];
                namesShort: string[];
                firstDay: number;
            };
            months: {
                names: string[];
                namesAbbr: string[];
            };
            patterns: {
                D: string;
                F: string;
                G: string;
                M: string;
                T: string;
                Y: string;
                d: string;
                g: string;
                m: string;
                s: string;
                t: string;
                u: string;
                y: string;
            };
            twoDigitYearMax: number;
        };
        calendars: {
            standard: {
                AM: string[];
                PM: string[];
                days: {
                    names: string[];
                    namesAbbr: string[];
                    namesShort: string[];
                    firstDay: number;
                };
                months: {
                    names: string[];
                    namesAbbr: string[];
                };
                patterns: {
                    D: string;
                    F: string;
                    G: string;
                    M: string;
                    T: string;
                    Y: string;
                    d: string;
                    g: string;
                    m: string;
                    s: string;
                    t: string;
                    u: string;
                    y: string;
                };
                twoDigitYearMax: number;
            };
        };
        numberFormat: {
            currency: {
                decimals: number;
                groupSize: number[];
                pattern: string[];
                symbol: string;
            };
            decimals: number;
            groupSize: number[];
            pattern: string[];
            percent: {
                decimals: number;
                groupSize: number[];
                pattern: string[];
                symbol: string;
            };
        };
    };

    var cultures: {[culture:string] : {
        name?: string;
        calendar?: {
            AM: string[];
            PM: string[];
            days: {
                names: string[];
                namesAbbr: string[];
                namesShort: string[];
                firstDay: number;
            };
            months: {
                names: string[];
                namesAbbr: string[];
            };
            patterns: {
                D: string;
                F: string;
                G: string;
                M: string;
                T: string;
                Y: string;
                d: string;
                g: string;
                m: string;
                s: string;
                t: string;
                u: string;
                y: string;
            };
            twoDigitYearMax: number;
        };
        calendars?: {
            standard: {
                AM: string[];
                PM: string[];
                days: {
                    names: string[];
                    namesAbbr: string[];
                    namesShort: string[];
                    firstDay: number;
                };
                months: {
                    names: string[];
                    namesAbbr: string[];
                };
                patterns: {
                    D: string;
                    F: string;
                    G: string;
                    M: string;
                    T: string;
                    Y: string;
                    d: string;
                    g: string;
                    m: string;
                    s: string;
                    t: string;
                    u: string;
                    y: string;
                };
                twoDigitYearMax: number;
            };
        };
        numberFormat?: {
            currency: {
                decimals: number;
                groupSize: number[];
                pattern: string[];
                symbol: string;
            };
            decimals: number;
            groupSize: number[];
            pattern: string[];
            percent: {
                decimals: number;
                groupSize: number[];
                pattern: string[];
                symbol: string;
            };
        };
    }};

    function destroy(selector: string): void;
    function destroy(element: Element): void;
    function destroy(element: JQuery): void;
    function format(format: string, ...values: any[]): string;

    function fx(selector: string): effects.Element;
    function fx(element: Element): effects.Element;
    function fx(element: JQuery): effects.Element;

    function htmlEncode(value: string): string;
    function init(selector: string, ...namespaces: any[]): void;
    function init(element: JQuery, ...namespaces: any[]): void;
    function init(element: Element, ...namespaces: any[]): void;
    function observable(data: any): kendo.data.ObservableObject;
    function observableHierarchy(array: any[]): kendo.data.ObservableArray;
    function parseDate(value: any, format?: string, culture?: string): Date;
    function parseFloat(value: any, culture?: string): number;
    function parseInt(value: any, culture?: string): number;
    function render(template:(data: any) => string, data: any[]): string;
    function resize(selector: string): void;
    function resize(element: JQuery): void;
    function resize(element: Element): void;
    function stringify(value: Object): string;
    function template(template: string, options?: TemplateOptions): (data: any) => string;
    function touchScroller(selector: string): void;
    function touchScroller(element: Element): void;
    function touchScroller(element: JQuery): void;
    function toString(value: number, format: string): string;
    function toString(value: Date, format: string): string;
    function unbind(selector: string): void;
    function unbind(element: JQuery): void;
    function unbind(element: Element): void;
    function guid(): string;
    function widgetInstance(element: JQuery, suite: typeof kendo.ui): kendo.ui.Widget;
    function widgetInstance(element: JQuery, suite: typeof kendo.mobile.ui): kendo.ui.Widget;
    function widgetInstance(element: JQuery, suite: typeof kendo.dataviz.ui): kendo.ui.Widget;


    var ns: string;

    var keys: {
        INSERT: number;
        DELETE: number;
        BACKSPACE: number;
        TAB: number;
        ENTER: number;
        ESC: number;
        LEFT: number;
        UP: number;
        RIGHT: number;
        DOWN: number;
        END: number;
        HOME: number;
        SPACEBAR: number;
        PAGEUP: number;
        PAGEDOWN: number;
        F2: number;
        F10: number;
        F12: number;
    }

    var support: {
        touch: boolean;
        pointers: boolean;
        scrollbar(): number;
        hasHW3D: boolean;
        hasNativeScrolling: boolean;
        devicePixelRatio: number;
        placeHolder: boolean;
        zoomLevel: number;
        mobileOS: {
            device: string;
            tablet: any;
            browser: string;
            name: string;
            majorVersion: string;
            minorVersion: string;
            flatVersion: number;
            appMode: boolean;
        };
        browser: {
            msie: boolean;
            webkit: boolean;
            safari: boolean;
            opera: boolean;
            version: string;
        };
    }

    interface TemplateOptions {
        paramName?: string;
        useWithBlock?: boolean;
    }

    class Class {
        static fn: Class;
        static extend(prototype: Object): Class;
    }

    class Observable extends Class {
        static fn: Observable;
        static extend(prototype: Object): Observable;

        bind(eventName: string, handler: Function): Observable;
        one(eventName: string, handler: Function): Observable;
        trigger(eventName: string, e?: any): boolean;
        unbind(eventName: string, handler?: any): Observable;
    }

    interface ViewOptions {
        tagName?: string;
        wrap?: boolean;
        model?: Object;
        init?: (e: ViewEvent) => void;
        show?: (e: ViewEvent) => void;
        hide?: (e: ViewEvent) => void;
    }

    interface ViewEvent {
        sender: View;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    class View extends Observable {
        constructor(element: Element, options?: ViewOptions);
        constructor(element: string, options?: ViewOptions);
        init(element: Element, options?: ViewOptions): void;
        init(element: string, options?: ViewOptions): void;
        render(container?: any): JQuery;
        destroy(): void;
        element: JQuery;
        content: any;
        tagName: string;
        model: Object;
    }

    class Layout extends View {
        showIn(selector: string, view: View): void;
        regions: { [selector: string]: View; };
    }

    class History extends Observable {
        start(options: Object): void;
        stop(): void;
        current: string;
        root: string;
        change(callback: Function): void;
        navigate(location: string, silent?: boolean): void;
    }

    var history: History;

    interface RouterOptions {
        init?: (e: RouterEvent) => void;
        routeMissing?: (e: RouterEvent) => void;
        change?: (e: RouterEvent) => void;
    }

    interface RouterEvent {
        sender: Router;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
        url: string;
    }

    class Route extends Class {
        route: RegExp;
        callback(url: string): void;
        worksWith(url: string): void;
    }

    class Router extends Observable {
        constructor(options?: RouterOptions);
        init(options?: RouterOptions): void;
        start(): void;
        destroy(): void;
        route(route: string, callback: Function): void;
        navigate(location: string, silent?: boolean): void;
        routes: Route[];
    }

}

declare module kendo.effects {
    interface Element {
        expand(direction: string): effects.Expand;
        expandHorizontal(): effects.Expand;
        expandVertical(): effects.Expand;
        fade(direction: string): effects.Fade;
        fadeIn(): effects.Fade;
        fadeOut(): effects.Fade;
        flip(axis: string, face: JQuery, back: JQuery): effects.Flip;
        flipHorizontal(face: JQuery, back: JQuery): effects.Flip;
        flipVertical(face: JQuery, back: JQuery): effects.Flip;
        pageturn(axis: string, face: JQuery, back: JQuery): effects.PageTurn;
        pageturnHorizontal(face: JQuery, back: JQuery): effects.PageTurn;
        pageturnVertical(face: JQuery, back: JQuery): effects.PageTurn;
        slideIn(direction: string): effects.SlideIn;
        slideInDown(): effects.SlideIn;
        slideInLeft(): effects.SlideIn;
        slideInRight(): effects.SlideIn;
        slideInUp(): effects.SlideIn;
        tile(direction: string, previous: JQuery): effects.Tile;
        tileDown(previous: JQuery): effects.Tile;
        tileLeft(previous: JQuery): effects.Tile;
        tileRight(previous: JQuery): effects.Tile;
        tileUp(previous: JQuery): effects.Tile;
        transfer(target: JQuery): effects.Transfer;
        zoom(direction: string): effects.Zoom;
        zoomIn(): effects.Zoom;
        zoomOut(): effects.Zoom;
    }

    interface Effect {
        play(): JQueryPromise<any>;
        reverse(): JQueryPromise<any>;
        duration(value: number): Effect;
        add(effect: Effect): Effect;
        stop(): Effect;
    }

    interface Expand extends Effect {
        duration(value: number): Expand;
        direction(value: string): Expand;
        stop(): Expand;
        add(effect: Effect): Expand;
    }

    interface Fade extends Effect {
        duration(value: number): Fade;
        direction(value: string): Fade;
        stop(): Fade;
        add(effect: Effect): Fade;
        startValue(value: number): Fade;
        endValue(value: number): Fade;
    }

    interface Flip extends Effect {
        duration(value: number): Flip;
        direction(value: string): Flip;
        stop(): Flip;
        add(effect: Effect): Flip;
    }

    interface PageTurn extends Effect {
        duration(value: number): PageTurn;
        direction(value: string): PageTurn;
        stop(): PageTurn;
        add(effect: Effect): PageTurn;
    }

    interface SlideIn extends Effect {
        duration(value: number): SlideIn;
        direction(value: string): SlideIn;
        stop(): SlideIn;
        add(effect: Effect): SlideIn;
    }

    interface Tile extends Effect {
        duration(value: number): Tile;
        direction(value: string): Tile;
        stop(): Tile;
        add(effect: Effect): Tile;
    }

    interface Transfer extends Effect {
        duration(value: number): Transfer;
        stop(): Transfer;
        add(effect: Effect): Transfer;
    }

    interface Zoom extends Effect {
        duration(value: number): Zoom;
        direction(value: string): Zoom;
        stop(): Zoom;
        add(effect: Effect): Zoom;
        startValue(value: number): Zoom;
        endValue(value: number): Zoom;
    }
}

declare module kendo.data {
    interface ObservableObjectEvent {
        sender?: ObservableObject;
        field?: string;
    }

    interface ObservableObjectSetEvent extends ObservableObjectEvent {
        value?: any;
        preventDefault?: Function;
    }


    class Binding extends Observable {
        source: any;
        parents: any[];
        path: string;
        dependencies: { [path: string]: boolean; };
        observable: boolean;
        constructor(parents: any[], path: string);
        change(e: Object): void;
        start(source: kendo.Observable): void;
        stop(source: kendo.Observable): void;
        get (): any;
        set (value: any): void;
        destroy(): void;
    }

    class EventBinding extends Binding {
        get (): void;
    }

    class TemplateBinding extends Binding {
        constructor(source: kendo.Observable, path: string, template: Function);
        render(value: Object): string;
    }

    module binders { }

    interface Bindings {
        [key: string]: Binding;
    }

    class Binder extends Class {
        static fn: Binder;
        static extend(prototype: Object): Binder;

        element: any;
        bindings: Bindings;
        constructor(element: any, bindings: Bindings, options?: BinderOptions);
        init(element: any, bindings: Bindings, options?: BinderOptions): void;
        bind(binding: Binding, attribute: string): void;
        destroy(): void;
        refresh(): void;
        refresh(attribute: string): void;
        options: BinderOptions;
    }

    interface BinderOptions {
    }

    class ObservableObject extends Observable{
        constructor(value?: any);
        init(value?: any): void;
        get(name: string): any;
        parent(): ObservableObject;
        set(name: string, value: any): void;
        toJSON(): Object;
        uid: string;
    }

    class Model extends ObservableObject {
        idField: string;
        _defaultId: any;
        fields: DataSourceSchemaModelFields;
        defaults: {
            [field: string]: any;
        };
        constructor(data?: any);
        init(data?: any):void;
        dirty: boolean;
        id: any;
        editable(field: string): boolean;
        isNew(): boolean;
        static idField: string;
        static fields: DataSourceSchemaModelFields;
        static define(options: DataSourceSchemaModelWithFieldsObject): typeof Model;
        static define(options: DataSourceSchemaModelWithFieldsArray): typeof Model;
    }

    class SchedulerEvent extends Model {
        constructor(data?: any);
        init(data?: any): void;

        description: string;
        end: Date;
        endTimezone: string;
        isAllDay: boolean;
        id: any;
        start: Date;
        startTimezone: string;
        recurrenceId: any;
        recurrenceRule: string;
        recurrenceException: string;
        static idField: string;
        static fields: DataSourceSchemaModelFields;
        static define(options: DataSourceSchemaModelWithFieldsObject): typeof SchedulerEvent;
        static define(options: DataSourceSchemaModelWithFieldsArray): typeof SchedulerEvent;
    }

    class GanttTask extends Model {
        constructor(data?: any);
        init(data?: any): void;

        id: any;
		parentId: number;
		orderId: number;
		title: string;
		start: Date;
		end: Date;
		percentComplete: number;
		summary: boolean;
		expanded: boolean;
        static idField: string;
        static fields: DataSourceSchemaModelFields;
        static define(options: DataSourceSchemaModelWithFieldsObject): typeof GanttTask;
        static define(options: DataSourceSchemaModelWithFieldsArray): typeof GanttTask;
    }

    class GanttDependency extends Model {
        constructor(data?: any);
        init(data?: any): void;

        id: any;
		predecessorId: number;
		successorId: number;
		type: number;
        static idField: string;
        static fields: DataSourceSchemaModelFields;
        static define(options: DataSourceSchemaModelWithFieldsObject): typeof GanttDependency;
        static define(options: DataSourceSchemaModelWithFieldsArray): typeof GanttDependency;
    }

    class Node extends Model {
        children: HierarchicalDataSource;

        append(model: any): void;
        level(): number;
        load(id: any): void;
        loaded(value: boolean): void;
        loaded(): boolean;
        parentNode(): Node;
    }

    class SchedulerDataSource extends DataSource {
        add(model: Object): kendo.data.SchedulerEvent;
        add(model: kendo.data.SchedulerEvent): kendo.data.SchedulerEvent;
        at(index: number): kendo.data.SchedulerEvent;
        cancelChanges(model?: kendo.data.SchedulerEvent): void;
        get(id: any): kendo.data.SchedulerEvent;
        getByUid(uid: string): kendo.data.SchedulerEvent;
        indexOf(value: kendo.data.SchedulerEvent): number;
        insert(index: number, model: kendo.data.SchedulerEvent): kendo.data.SchedulerEvent;
        insert(index: number, model: Object): kendo.data.SchedulerEvent;
        remove(model: kendo.data.SchedulerEvent): void;
    }

    class GanttDataSource extends DataSource {
        add(model: Object): kendo.data.GanttTask;
        add(model: kendo.data.GanttTask): kendo.data.GanttTask;
        at(index: number): kendo.data.GanttTask;
        cancelChanges(model?: kendo.data.GanttTask): void;
        get(id: any): kendo.data.GanttTask;
        getByUid(uid: string): kendo.data.GanttTask;
        indexOf(value: kendo.data.GanttTask): number;
        insert(index: number, model: Object): kendo.data.GanttTask;
        insert(index: number, model: kendo.data.GanttTask): kendo.data.GanttTask;
        remove(model: kendo.data.GanttTask): void;
    }

    class GanttDependencyDataSource extends DataSource {
        add(model: Object): kendo.data.GanttDependency;
        add(model: kendo.data.GanttDependency): kendo.data.GanttDependency;
        at(index: number): kendo.data.GanttDependency;
        cancelChanges(model?: kendo.data.GanttDependency): void;
        get(id: any): kendo.data.GanttDependency;
        getByUid(uid: string): kendo.data.GanttDependency;
        indexOf(value: kendo.data.GanttDependency): number;
        insert(index: number, model: Object): kendo.data.GanttDependency;
        insert(index: number, model: kendo.data.GanttDependency): kendo.data.GanttDependency;
        remove(model: kendo.data.GanttDependency): void;
    }

    class HierarchicalDataSource extends DataSource {
        constructor(options?: HierarchicalDataSourceOptions);
        init(options?: HierarchicalDataSourceOptions): void;
    }

    interface HierarchicalDataSourceOptions extends DataSourceOptions {
        schema?: HierarchicalDataSourceSchema;
    }


    interface HierarchicalDataSourceSchema extends DataSourceSchemaWithOptionsModel {
        model?: HierarchicalDataSourceSchemaModel;
    }

    interface HierarchicalDataSourceSchemaModel extends DataSourceSchemaModel {
        hasChildren?: any;
        children?: any;
    }

    interface PivotDiscoverRequestRestrictionOptions {
        catalogName: string;
        cubeName: string;
    }

    interface PivotDiscoverRequestDataOptions {
        command: string;
        restrictions: PivotDiscoverRequestRestrictionOptions;
    }

    interface PivotDiscoverRequestOptions {
        data: PivotDiscoverRequestDataOptions;
    }

    interface PivotTransportConnection {
        catalog?: string;
        cube?: string;
    }

    interface PivotTransportDiscover {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface PivotTransport {
        discover?: any;
        read?: any;
    }

    interface PivotTransportWithObjectOperations extends PivotTransport {
        connection: PivotTransportConnection;
        discover?: PivotTransportDiscover;
        read?: DataSourceTransportRead;
    }

    interface PivotTransportWithFunctionOperations extends PivotTransport {
        discover?: (options: DataSourceTransportOptions) => void;
        read?: (options: DataSourceTransportOptions) => void;
    }

    interface PivotDataSourceAxisOptions {
        name: string;
        expand?: boolean;
    }

    interface PivotDataSourceMeasureOptions {
        values: string[];
        axis?: string;
    }

    interface PivotDataSourceOptions extends DataSourceOptions {
        columns?: PivotDataSourceAxisOptions[];
        measures?: PivotDataSourceMeasureOptions[];
        rows?: PivotDataSourceAxisOptions[];
        transport?: PivotTransport;
        schema?: PivotSchema;
    }

    interface PivotTupleModel {
        children: PivotTupleModel[];
        caption?: string;
        name: string;
        levelName?: string;
        levelNum: number;
        hasChildren?: boolean;
        hierarchy?: string;
    }

    interface PivotSchemaRowAxis {
        tuples: PivotTupleModel[];
    }

    interface PivotSchemaColumnAxis {
        tuples: PivotTupleModel[];
    }

    interface PivotSchemaAxes {
        rows: PivotSchemaRowAxis;
        columns: PivotSchemaColumnAxis;
    }

    interface PivotSchema extends DataSourceSchema{
        axes?: any;
        catalogs?: any;
        cubes?: any;
        data?: any;
        dimensions?: any;
        hierarchies?: any;
        levels?: any;
        measures?: any;
    }

    class PivotDataSource extends DataSource {
        axes(): PivotSchemaAxes;
        constructor(options?: PivotDataSourceOptions);
        init(options?: PivotDataSourceOptions): void;
        catalog(val: string): void;
        columns(val: string[]): string[];
        cube(val: string): void;
        discover(options: PivotDiscoverRequestOptions): JQueryPromise<any>;
        measures(val: string[]): string[];
        measuresAxis(): string;
        rows(val: string[]): string[];
        schemaCatalogs(): JQueryPromise<any>;
        schemaCubes(): JQueryPromise<any>;
        schemaDimensions(): JQueryPromise<any>;
        schemaHierarchies(): JQueryPromise<any>;
        schemaLevels(): JQueryPromise<any>;
        schemaMeasures(): JQueryPromise<any>;
    }

    interface DataSourceTransport {
        parameterMap?(data: DataSourceTransportParameterMapData, type: string): any;
    }

    interface DataSourceParameterMapDataAggregate {
        field?: string;
        aggregate?: string;
    }

    interface DataSourceParameterMapDataGroup {
        aggregate?: DataSourceParameterMapDataAggregate[];
        field?: string;
        dir?: string;
    }

    interface DataSourceParameterMapDataFilter {
        field?: string;
        filters?: DataSourceParameterMapDataFilter[];
        logic?: string;
        operator?: string;
        value?: any;
    }

    interface DataSourceParameterMapDataSort {
        field?: string;
        dir?: string;
    }

    interface DataSourceTransportParameterMapData {
        aggregate?: DataSourceParameterMapDataAggregate[];
        group?: DataSourceParameterMapDataGroup[];
        filter?: DataSourceParameterMapDataFilter;
        models?: Model[];
        page?: number;
        pageSize?: number;
        skip?: number;
        sort?: DataSourceParameterMapDataSort[];
        take?: number;
    }

    interface DataSourceSchema {
        model?: any;
    }

    interface DataSourceSchemaWithOptionsModel extends DataSourceSchema {
        model?: DataSourceSchemaModel;
    }

    interface DataSourceSchemaWithConstructorModel extends DataSourceSchema {
        model?:  typeof Model;
    }

    interface DataSourceSchemaModel {
        id?: string;
        fields?: any;
    }

    interface DataSourceSchemaModelWithFieldsArray extends DataSourceSchemaModel {
        fields?: DataSourceSchemaModelField[];
    }

    interface DataSourceSchemaModelWithFieldsObject extends DataSourceSchemaModel {
        fields?: DataSourceSchemaModelFields;
    }

    interface DataSourceSchemaModelFields {
        [index: string]: DataSourceSchemaModelField;
    }

    interface DataSourceSchemaModelField {
        field?: string;
        from?: string;
        defaultValue?: any;
        editable?: boolean;
        nullable?: boolean;
        parse?: Function;
        type?: string;
        validation?: DataSourceSchemaModelFieldValidation;
    }

    interface DataSourceSchemaModelFieldValidation {
        required?: boolean;
        min?: any;
        max?: any;
    }

    class ObservableArray extends Observable {
        constructor(array?: any[]);
        init(array?: any[]): void;
        length: number;
        join(separator: string): string;
        parent(): ObservableObject;
        pop(): ObservableObject;
        push(...items: any[]): number;
        slice(begin: number, end?: number): any[];
        splice(start: number): any[];
        splice(start: number, deleteCount: number, ...items: any[]): any[];
        shift(): any;
        toJSON(): any[];
        unshift(...items: any[]): number;
        wrapAll(source: Object, target: Object): any;
        wrap(object: Object, parent: Object): any;
        indexOf(item: any): number;
        forEach(callback: (item: Object, index: number, source: ObservableArray) => void ): void;
        map(callback: (item: Object, index: number, source: ObservableArray) => any): any[];
        filter(callback: (item: Object, index: number, source: ObservableArray) => boolean): any[];
        find(callback: (item: Object, index: number, source: ObservableArray) => boolean): any;
        every(callback: (item: Object, index: number, source: ObservableArray) => boolean): boolean;
        some(callback: (item: Object, index: number, source: ObservableArray) => boolean): boolean;
        remove(item: Object): void;
    }

    interface ObservableArrayEvent {
        field?: string;
        action?: string;
        index?: number;
        items?: kendo.data.Model[];
    }

    class DataSource extends Observable{
        constructor(options?: DataSourceOptions);
        init(options?: DataSourceOptions): void;
        static create(options?: DataSourceOptions): DataSource;
        options: DataSourceOptions;
        add(model: Object): kendo.data.Model;
        add(model: kendo.data.Model): kendo.data.Model;
        aggregate(val?: any): any;
        aggregates(): any;
        at(index: number): kendo.data.ObservableObject;
        cancelChanges(model?: kendo.data.Model): void;
        data(): kendo.data.ObservableArray;
        data(value: any): void;
        fetch(callback?: Function): void;
        filter(filters: DataSourceFilterItem): void;
        filter(filters: DataSourceFilterItem[]): void;
        filter(filters: DataSourceFilters): void;
        filter(): DataSourceFilters;
        get(id: any): kendo.data.Model;
        getByUid(uid: string): kendo.data.Model;
        group(groups: any): void;
        group(): any;
        hasChanges(): boolean;
        indexOf(value: kendo.data.ObservableObject): number;
        insert(index: number, model: kendo.data.Model): kendo.data.Model;
        insert(index: number, model: Object): kendo.data.Model;
        page(): number;
        page(page: number): void;
        pageSize(): number;
        pageSize(size: number): void;
        query(options?: any): void;
        read(data?: any): void;
        remove(model: kendo.data.Model): void;
        sort(sort: DataSourceSortItem): void;
        sort(sort: DataSourceSortItem[]): void;
        sort(): DataSourceSortItem[];
        sync(): void;
        total(): number;
        totalPages(): number;
        view(): kendo.data.ObservableArray;
    }

    interface DataSourceAggregateItem {
        field?: string;
        aggregate?: string;
    }

    interface DataSourceFilter {
    }

    interface DataSourceFilterItem extends DataSourceFilter {
        operator?: string;
        field?: string;
        value?: any;
    }

    interface DataSourceFilters extends DataSourceFilter {
        logic?: string;
        filters?: DataSourceFilter[];
    }

    interface DataSourceGroupItemAggregate {
        field?: string;
        aggregate?: string;
    }

    interface DataSourceGroupItem {
        field?: string;
        dir?: string;
        aggregates?: DataSourceGroupItemAggregate[];
    }

    interface DataSourceSchema {
        aggregates?: any;
        data?: any;
        errors?: any;
        groups?: any;
        parse?: Function;
        total?: any;
        type?: string;
    }

    interface DataSourceSortItem {
        field?: string;
        dir?: string;
    }

    interface DataSourceTransportCreate {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransportDestroy {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransportRead {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransportUpdate {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransport {
        create?: any;
        destroy?: any;
        read?: any;
        update?: any;
    }

    interface DataSourceTransportWithObjectOperations extends DataSourceTransport {
        create?: DataSourceTransportCreate;
        destroy?: DataSourceTransportDestroy;
        read?: DataSourceTransportRead;
        update?: DataSourceTransportUpdate;
    }

    interface DataSourceTransportWithFunctionOperations extends DataSourceTransport {
        create?: (options: DataSourceTransportOptions) => void;
        destroy?: (options: DataSourceTransportOptions) => void;
        read?: (options: DataSourceTransportReadOptions) => void;
        update?: (options: DataSourceTransportOptions) => void;
    }

    interface DataSourceTransportOptions {
        success: (data?: any) => void;
        error: (error?: any) => void;
        data: any;
    }

    interface DataSourceTransportReadOptionsData {
        sort?: DataSourceSortItem[];
        filter?: DataSourceFilters;
        take?: number;
        skip?: number;
    }

    interface DataSourceTransportReadOptions extends DataSourceTransportOptions {
        data: DataSourceTransportReadOptionsData;
    }

    interface DataSourceTransportBatchOptionsData {
        models: any[];
    }

    interface DataSourceTransportBatchOptions extends DataSourceTransportOptions {
        data: DataSourceTransportBatchOptionsData;
    }

    interface DataSourceOptions {
        aggregate?: DataSourceAggregateItem[];
        autoSync?: boolean;
        batch?: boolean;
        data?: any;
        filter?: any;
        group?: DataSourceGroupItem[];
        page?: number;
        pageSize?: number;
        schema?: DataSourceSchema;
        serverAggregates?: boolean;
        serverFiltering?: boolean;
        serverGrouping?: boolean;
        serverPaging?: boolean;
        serverSorting?: boolean;
        sort?: any;
        transport?: DataSourceTransport;
        type?: string;
        change? (e: DataSourceChangeEvent): void;
        error?(e: DataSourceErrorEvent): void;
        sync?(e: DataSourceEvent): void;
        requestStart?(e: DataSourceRequestStartEvent): void;
        requestEnd?(e: DataSourceRequestEndEvent): void;
    }

    interface DataSourceEvent {
        sender?: DataSource;
    }

    interface DataSourceItemOrGroup {
    }

    interface DataSourceGroup extends DataSourceItemOrGroup {
        aggregates: any[];
        field: string;
        hasSubgroups: boolean;
        items: DataSourceItemOrGroup[];
        value: any;
    }

    interface DataSourceChangeEvent extends DataSourceEvent {
        field?: string;
        value?: Model;
        action?: string;
        index?: number;
        items?: DataSourceItemOrGroup[];
        node?: any;
    }

    interface DataSourceErrorEvent extends DataSourceEvent {
        xhr: JQueryXHR;
        status: string;
        errorThrown: any;
        errors?: any;
    }

    interface DataSourceRequestStartEvent extends DataSourceEvent {
    }

    interface DataSourceRequestEndEvent extends DataSourceEvent {
        response?: any;
        type?: string;
    }
}

declare module kendo.data.transports {
    var odata : DataSourceTransport;
}

declare module kendo.ui {
    function progress(container: JQuery, toggle: boolean): void;

    class Widget extends Observable {
        static fn: Widget;
        static extend(prototype: Object): Widget;

        constructor(element: Element, options?: Object);
        constructor(element: JQuery, options?: Object);
        constructor(selector: String, options?: Object);
        init(element: Element, options?: Object): void;
        init(element: JQuery, options?: Object): void;
        init(selector: String, options?: Object): void;
        destroy(): void;
        element: JQuery;
        setOptions(options: Object): void;
        resize(force?: boolean): void;
    }

    function plugin(widget: typeof kendo.ui.Widget, register?: typeof kendo.ui, prefix?: String): void;
    function plugin(widget: any, register?: typeof kendo.ui, prefix?: String): void;
    function plugin(widget: typeof kendo.ui.Widget, register?: typeof kendo.mobile.ui, prefix?: String): void;
    function plugin(widget: any, register?: typeof kendo.mobile.ui, prefix?: String): void;
    function plugin(widget: typeof kendo.ui.Widget, register?: typeof kendo.dataviz.ui, prefix?: String): void;
    function plugin(widget: any, register?: typeof kendo.dataviz.ui, prefix?: String): void;

    class Draggable extends kendo.ui.Widget{
        element: JQuery;
        currentTarget: JQuery;
        constructor(element: Element, options?: DraggableOptions);
        options: DraggableOptions;
    }

    interface DraggableEvent {
        sender?: Draggable;
    }

    class DropTarget extends kendo.ui.Widget{
        element: JQuery;
        constructor(element: Element, options?: DropTargetOptions);
        options: DropTargetOptions;
        static destroyGroup(groupName: string): void;
    }

    interface DropTargetOptions {
        group?: string;
        dragenter?(e: DropTargetDragenterEvent): void;
        dragleave?(e: DropTargetDragleaveEvent): void;
        drop?(e: DropTargetDropEvent): void;
    }

    interface DropTargetEvent {
        sender?: DropTarget;
    }

    interface DropTargetDragenterEvent extends DropTargetEvent {
        draggable?: kendo.ui.Draggable;
    }

    interface DropTargetDragleaveEvent extends DropTargetEvent {
        draggable?: kendo.ui.Draggable;
    }

    interface DropTargetDropEvent extends DropTargetEvent {
        draggable?: kendo.ui.Draggable;
    }

    class DropTargetArea extends kendo.ui.Widget{
        element: JQuery;
        constructor(element: Element, options?: DropTargetAreaOptions);
        options: DropTargetAreaOptions;
    }

    interface DropTargetAreaOptions {
        group?: string;
        filter?: string;
        dragenter?(e: DropTargetAreaDragenterEvent): void;
        dragleave?(e: DropTargetAreaDragleaveEvent): void;
        drop?(e: DropTargetAreaDropEvent): void;
    }

    interface DropTargetAreaEvent {
        sender: DropTargetArea;
    }

    interface DropTargetAreaDragenterEvent extends DropTargetAreaEvent {
        draggable?: JQuery;
        dropTarget?: JQuery;
    }

    interface DropTargetAreaDragleaveEvent extends DropTargetAreaEvent {
        draggable?: JQuery;
        dropTarget?: JQuery;
    }

    interface DropTargetAreaDropEvent extends DropTargetAreaEvent {
        draggable?: kendo.ui.Draggable;
        dropTarget?: JQuery;
    }

    interface DraggableOptions {
        axis?: string;
        container?: JQuery;
        cursorOffset?: any;
        distance?: number;
        filter?: string;
        group?: string;
        hint?: Function;
        ignore?: string;
        drag?(e: DraggableEvent): void;
        dragcancel?(e: DraggableEvent): void;
        dragend?(e: DraggableEvent): void;
        dragstart?(e: DraggableEvent): void;
    }

    interface GridColumnEditorOptions {
        field?: string;
        format?: string;
        model?: kendo.data.Model;
        values?: any[];
    }

    interface GridColumn {
        editor?(container: JQuery, options: GridColumnEditorOptions): void;
    }
}

declare module kendo.mobile {
    function init(selector: string): void;
    function init(element: JQuery): void;
    function init(element: Element): void;

    class Application extends Observable {
        constructor(element?: any, options?: ApplicationOptions);
        init(element?: any, options?: ApplicationOptions): void;
        options: ApplicationOptions;
        hideLoading(): void;
        navigate(url: string, transition?: string): void;
        scroller(): kendo.mobile.ui.Scroller;
        showLoading(): void;
        view(): kendo.mobile.ui.View;
    }

    interface ApplicationOptions {
        hideAddressBar?: boolean;
        updateDocumentTitle?: boolean;
        initial?: string;
        layout?: string;
        loading?: string;
        platform?: string;
        serverNavigation?: boolean;
        transition?: string;
    }

    interface ApplicationEvent {
        sender: Application;
    }
}

declare module kendo.mobile.ui {

    class Widget extends kendo.ui.Widget {
    }

    interface TouchAxis {
        location?: number;
        startLocation?: number;
        client?: number;
        delta?: number;
        velocity?: number;
    }

    interface TouchEventOptions {
        target?: JQuery;
        x?: TouchAxis;
        y?: TouchAxis;
    }

    interface Point {
        x?: number;
        y?: number;
    }
}
declare module kendo.dataviz.ui {
    function registerTheme(name: string, options: any): void;

    function plugin(widget: typeof kendo.ui.Widget): void;
    function plugin(widget: any): void;
}

declare module kendo.dataviz.map {
    class Location {
    }

    class Marker {
    }

    class Extent {
    }
}

declare module kendo.dataviz.map.layer {
    class Shape {
    }
}

declare module kendo.dataviz.drawing {
    class Shape {
    }
}

declare module kendo.dataviz.geometry {
    class Arc extends Observable {
        options: ArcOptions;
        bbox(matrix: kendo.dataviz.geometry.Matrix): kendo.dataviz.geometry.Rect;
        getAnticlockwise(): boolean;
        getCenter(): kendo.dataviz.geometry.Point;
        getEndAngle(): number;
        getRadiusX(): number;
        getRadiusY(): number;
        getStartAngle(): number;
        pointAt(angle: number): kendo.dataviz.geometry.Point;
        setAnticlockwise(value: boolean): kendo.dataviz.geometry.Arc;
        setCenter(value: kendo.dataviz.geometry.Point): kendo.dataviz.geometry.Arc;
        setEndAngle(value: number): kendo.dataviz.geometry.Arc;
        setRadiusX(value: number): kendo.dataviz.geometry.Arc;
        setRadiusY(value: number): kendo.dataviz.geometry.Arc;
        setStartAngle(value: number): kendo.dataviz.geometry.Arc;
        anticlockwise: boolean;
        center: kendo.dataviz.geometry.Point;
        endAngle: number;
        radiusX: number;
        radiusY: number;
        startAngle: number;
    }

    interface ArcOptions {
        name?: string;
    }

    interface ArcEvent {
        sender: Arc;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Circle extends Observable {
        options: CircleOptions;
        bbox(matrix: kendo.dataviz.geometry.Matrix): kendo.dataviz.geometry.Rect;
        clone(): kendo.dataviz.geometry.Circle;
        equals(other: kendo.dataviz.geometry.Circle): boolean;
        getCenter(): kendo.dataviz.geometry.Point;
        getRadius(): number;
        pointAt(angle: number): kendo.dataviz.geometry.Point;
        setCenter(value: kendo.dataviz.geometry.Point): kendo.dataviz.geometry.Point;
        setCenter(value: any): kendo.dataviz.geometry.Point;
        setRadius(value: number): kendo.dataviz.geometry.Circle;
        center: kendo.dataviz.geometry.Point;
        radius: number;
    }

    interface CircleOptions {
        name?: string;
    }

    interface CircleEvent {
        sender: Circle;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Matrix extends Observable {
        options: MatrixOptions;
        clone(): kendo.dataviz.geometry.Matrix;
        equals(other: kendo.dataviz.geometry.Matrix): boolean;
        round(digits: number): kendo.dataviz.geometry.Matrix;
        multiplyCopy(matrix: kendo.dataviz.geometry.Matrix): kendo.dataviz.geometry.Matrix;
        toArray(digits: number): any;
        toString(digits: number, separator: string): string;
        a: number;
        b: number;
        c: number;
        d: number;
        e: number;
        f: number;
    }

    interface MatrixOptions {
        name?: string;
    }

    interface MatrixEvent {
        sender: Matrix;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Point extends Observable {
        options: PointOptions;
        clone(): kendo.dataviz.geometry.Point;
        distanceTo(point: kendo.dataviz.geometry.Point): number;
        equals(other: kendo.dataviz.geometry.Point): boolean;
        getX(): number;
        getY(): number;
        move(x: number, y: number): kendo.dataviz.geometry.Point;
        rotate(angle: number, center: kendo.dataviz.geometry.Point): kendo.dataviz.geometry.Point;
        rotate(angle: number, center: any): kendo.dataviz.geometry.Point;
        round(digits: number): kendo.dataviz.geometry.Point;
        scale(scaleX: number, scaleY: number): kendo.dataviz.geometry.Point;
        scaleCopy(scaleX: number, scaleY: number): kendo.dataviz.geometry.Point;
        setX(value: number): kendo.dataviz.geometry.Point;
        setY(value: number): kendo.dataviz.geometry.Point;
        toArray(digits: number): any;
        toString(digits: number, separator: string): string;
        transform(tansformation: kendo.dataviz.geometry.Transformation): kendo.dataviz.geometry.Point;
        transformCopy(tansformation: kendo.dataviz.geometry.Transformation): kendo.dataviz.geometry.Point;
        translate(dx: number, dy: number): kendo.dataviz.geometry.Point;
        translateWith(vector: kendo.dataviz.geometry.Point): kendo.dataviz.geometry.Point;
        translateWith(vector: any): kendo.dataviz.geometry.Point;
        x: number;
        y: number;
    }

    interface PointOptions {
        name?: string;
    }

    interface PointEvent {
        sender: Point;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Rect extends Observable {
        options: RectOptions;
        bbox(matrix: kendo.dataviz.geometry.Matrix): kendo.dataviz.geometry.Rect;
        bottomLeft(): kendo.dataviz.geometry.Point;
        bottomRight(): kendo.dataviz.geometry.Point;
        center(): kendo.dataviz.geometry.Point;
        getOrigin(): kendo.dataviz.geometry.Point;
        getSize(): kendo.dataviz.geometry.Size;
        height(): number;
        setOrigin(value: kendo.dataviz.geometry.Point): kendo.dataviz.geometry.Rect;
        setOrigin(value: any): kendo.dataviz.geometry.Rect;
        setSize(value: kendo.dataviz.geometry.Size): kendo.dataviz.geometry.Rect;
        setSize(value: any): kendo.dataviz.geometry.Rect;
        topLeft(): kendo.dataviz.geometry.Point;
        topRight(): kendo.dataviz.geometry.Point;
        width(): number;
        origin: kendo.dataviz.geometry.Point;
        size: kendo.dataviz.geometry.Size;
    }

    interface RectOptions {
        name?: string;
    }

    interface RectEvent {
        sender: Rect;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Size extends Observable {
        options: SizeOptions;
        clone(): kendo.dataviz.geometry.Size;
        equals(other: kendo.dataviz.geometry.Size): boolean;
        getWidth(): number;
        getHeight(): number;
        setWidth(value: number): kendo.dataviz.geometry.Size;
        setHeight(value: number): kendo.dataviz.geometry.Size;
        width: number;
        height: number;
    }

    interface SizeOptions {
        name?: string;
    }

    interface SizeEvent {
        sender: Size;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Transformation extends Observable {
        options: TransformationOptions;
        matrix(): kendo.dataviz.geometry.Matrix;
        multiply(transformation: kendo.dataviz.geometry.Transformation): kendo.dataviz.geometry.Transformation;
        rotate(angle: number, x: number, y: number): kendo.dataviz.geometry.Transformation;
        scale(scaleX: number, scaleY: number): kendo.dataviz.geometry.Transformation;
        translate(x: number, y: number): kendo.dataviz.geometry.Transformation;
    }

    interface TransformationOptions {
        name?: string;
    }

    interface TransformationEvent {
        sender: Transformation;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


}
declare module kendo.ui {
    class AutoComplete extends kendo.ui.Widget {
        static fn: AutoComplete;
        static extend(proto: Object): AutoComplete;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: AutoCompleteOptions);
        options: AutoCompleteOptions;
        dataSource: kendo.data.DataSource;
        close(): void;
        dataItem(index?: number): any;
        destroy(): void;
        enable(enable: boolean): void;
        focus(): void;
        readonly(readonly: boolean): void;
        refresh(): void;
        search(word: string): void;
        select(item: string): void;
        select(item: Element): void;
        select(item: JQuery): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        suggest(value: string): void;
        value(): string;
        value(value: string): void;
        list: JQuery;
        ul: JQuery;
    }

    interface AutoCompleteAnimationClose {
        duration?: number;
        effects?: string;
    }

    interface AutoCompleteAnimationOpen {
        duration?: number;
        effects?: string;
    }

    interface AutoCompleteAnimation {
        close?: AutoCompleteAnimationClose;
        open?: AutoCompleteAnimationOpen;
    }

    interface AutoCompleteOptions {
        name?: string;
        animation?: AutoCompleteAnimation;
        dataSource?: any;
        dataTextField?: string;
        delay?: number;
        enable?: boolean;
        filter?: string;
        height?: number;
        highlightFirst?: boolean;
        ignoreCase?: boolean;
        minLength?: number;
        placeholder?: string;
        separator?: string;
        suggest?: boolean;
        headerTemplate?: any;
        template?: any;
        valuePrimitive?: boolean;
        change?(e: AutoCompleteChangeEvent): void;
        close?(e: AutoCompleteCloseEvent): void;
        dataBound?(e: AutoCompleteDataBoundEvent): void;
        open?(e: AutoCompleteOpenEvent): void;
        select?(e: AutoCompleteSelectEvent): void;
    }

    interface AutoCompleteEvent {
        sender: AutoComplete;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface AutoCompleteChangeEvent extends AutoCompleteEvent {
    }

    interface AutoCompleteCloseEvent extends AutoCompleteEvent {
    }

    interface AutoCompleteDataBoundEvent extends AutoCompleteEvent {
    }

    interface AutoCompleteOpenEvent extends AutoCompleteEvent {
    }

    interface AutoCompleteSelectEvent extends AutoCompleteEvent {
        item?: JQuery;
    }


    class Button extends kendo.ui.Widget {
        static fn: Button;
        static extend(proto: Object): Button;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ButtonOptions);
        options: ButtonOptions;
        enable(toggle: boolean): void;
    }

    interface ButtonOptions {
        name?: string;
        enable?: boolean;
        icon?: string;
        imageUrl?: string;
        spriteCssClass?: string;
        click?(e: ButtonClickEvent): void;
    }

    interface ButtonEvent {
        sender: Button;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ButtonClickEvent extends ButtonEvent {
        event?: any;
    }


    class Calendar extends kendo.ui.Widget {
        static fn: Calendar;
        static extend(proto: Object): Calendar;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: CalendarOptions);
        options: CalendarOptions;
        current(): Date;
        destroy(): void;
        max(): Date;
        max(value: Date): void;
        max(value: string): void;
        min(): Date;
        min(value: Date): void;
        min(value: string): void;
        navigate(value: Date, view: string): void;
        navigateDown(value: Date): void;
        navigateToFuture(): void;
        navigateToPast(): void;
        navigateUp(): void;
        value(): Date;
        value(value: Date): void;
        value(value: string): void;
        view(): any;
    }

    interface CalendarMonth {
        content?: string;
        empty?: string;
    }

    interface CalendarOptions {
        name?: string;
        culture?: string;
        dates?: any;
        depth?: string;
        footer?: any;
        format?: string;
        max?: Date;
        min?: Date;
        month?: CalendarMonth;
        start?: string;
        value?: Date;
        change?(e: CalendarEvent): void;
        navigate?(e: CalendarEvent): void;
    }

    interface CalendarEvent {
        sender: Calendar;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class ColorPalette extends kendo.ui.Widget {
        static fn: ColorPalette;
        static extend(proto: Object): ColorPalette;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ColorPaletteOptions);
        options: ColorPaletteOptions;
        value(): string;
        value(color?: string): void;
        color(): kendo.Color;
        color(color?: kendo.Color): void;
        enable(enable?: boolean): void;
    }

    interface ColorPaletteTileSize {
        width?: number;
        height?: number;
    }

    interface ColorPaletteOptions {
        name?: string;
        palette?: any;
        columns?: number;
        tileSize?: ColorPaletteTileSize;
        value?: string;
        change?(e: ColorPaletteEvent): void;
    }

    interface ColorPaletteEvent {
        sender: ColorPalette;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class ColorPicker extends kendo.ui.Widget {
        static fn: ColorPicker;
        static extend(proto: Object): ColorPicker;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ColorPickerOptions);
        options: ColorPickerOptions;
        close(): void;
        open(): void;
        toggle(): void;
        value(): string;
        value(color?: string): void;
        color(): kendo.Color;
        color(color?: kendo.Color): void;
        enable(enable?: boolean): void;
    }

    interface ColorPickerTileSize {
        width?: number;
        height?: number;
    }

    interface ColorPickerOptions {
        name?: string;
        buttons?: boolean;
        columns?: number;
        tileSize?: ColorPickerTileSize;
        messages?: any;
        palette?: any;
        opacity?: boolean;
        preview?: boolean;
        toolIcon?: string;
        value?: string;
        change?(e: ColorPickerChangeEvent): void;
        select?(e: ColorPickerSelectEvent): void;
        open?(e: ColorPickerEvent): void;
        close?(e: ColorPickerEvent): void;
    }

    interface ColorPickerEvent {
        sender: ColorPicker;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ColorPickerChangeEvent extends ColorPickerEvent {
        value?: string;
    }

    interface ColorPickerSelectEvent extends ColorPickerEvent {
        value?: string;
    }


    class ComboBox extends kendo.ui.Widget {
        static fn: ComboBox;
        static extend(proto: Object): ComboBox;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ComboBoxOptions);
        options: ComboBoxOptions;
        dataSource: kendo.data.DataSource;
        close(): void;
        dataItem(index?: number): any;
        destroy(): void;
        enable(enable: boolean): void;
        readonly(readonly: boolean): void;
        focus(): void;
        open(): void;
        refresh(): void;
        search(word: string): void;
        select(): number;
        select(li: JQuery): void;
        select(li: number): void;
        select(li: Function): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        suggest(value: string): void;
        text(): string;
        text(text: string): void;
        toggle(toggle: boolean): void;
        value(): string;
        value(value: string): void;
        input: JQuery;
        list: JQuery;
        ul: JQuery;
    }

    interface ComboBoxAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface ComboBoxAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface ComboBoxAnimation {
        close?: ComboBoxAnimationClose;
        open?: ComboBoxAnimationOpen;
    }

    interface ComboBoxOptions {
        name?: string;
        animation?: ComboBoxAnimation;
        autoBind?: boolean;
        cascadeFrom?: string;
        cascadeFromField?: string;
        dataSource?: any;
        dataTextField?: string;
        dataValueField?: string;
        delay?: number;
        enable?: boolean;
        filter?: string;
        height?: number;
        highlightFirst?: boolean;
        ignoreCase?: string;
        index?: number;
        minLength?: number;
        placeholder?: string;
        suggest?: boolean;
        headerTemplate?: any;
        template?: any;
        text?: string;
        value?: string;
        valuePrimitive?: boolean;
        change?(e: ComboBoxChangeEvent): void;
        close?(e: ComboBoxCloseEvent): void;
        dataBound?(e: ComboBoxDataBoundEvent): void;
        open?(e: ComboBoxOpenEvent): void;
        select?(e: ComboBoxSelectEvent): void;
        cascade?(e: ComboBoxCascadeEvent): void;
    }

    interface ComboBoxEvent {
        sender: ComboBox;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ComboBoxChangeEvent extends ComboBoxEvent {
    }

    interface ComboBoxCloseEvent extends ComboBoxEvent {
    }

    interface ComboBoxDataBoundEvent extends ComboBoxEvent {
    }

    interface ComboBoxOpenEvent extends ComboBoxEvent {
    }

    interface ComboBoxSelectEvent extends ComboBoxEvent {
        item?: JQuery;
    }

    interface ComboBoxCascadeEvent extends ComboBoxEvent {
    }


    class ContextMenu extends kendo.ui.Widget {
        static fn: ContextMenu;
        static extend(proto: Object): ContextMenu;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ContextMenuOptions);
        options: ContextMenuOptions;
        append(item: any, referenceItem: string): kendo.ui.ContextMenu;
        append(item: any, referenceItem: JQuery): kendo.ui.ContextMenu;
        close(element: Element): kendo.ui.ContextMenu;
        close(element: JQuery): kendo.ui.ContextMenu;
        destroy(): void;
        enable(element: string, enable: boolean): kendo.ui.ContextMenu;
        enable(element: Element, enable: boolean): kendo.ui.ContextMenu;
        enable(element: JQuery, enable: boolean): kendo.ui.ContextMenu;
        insertAfter(item: string, referenceItem: string): kendo.ui.ContextMenu;
        insertAfter(item: string, referenceItem: Element): kendo.ui.ContextMenu;
        insertAfter(item: string, referenceItem: JQuery): kendo.ui.ContextMenu;
        insertAfter(item: Element, referenceItem: string): kendo.ui.ContextMenu;
        insertAfter(item: Element, referenceItem: Element): kendo.ui.ContextMenu;
        insertAfter(item: Element, referenceItem: JQuery): kendo.ui.ContextMenu;
        insertAfter(item: JQuery, referenceItem: string): kendo.ui.ContextMenu;
        insertAfter(item: JQuery, referenceItem: Element): kendo.ui.ContextMenu;
        insertAfter(item: JQuery, referenceItem: JQuery): kendo.ui.ContextMenu;
        insertBefore(item: string, referenceItem: string): kendo.ui.ContextMenu;
        insertBefore(item: string, referenceItem: Element): kendo.ui.ContextMenu;
        insertBefore(item: string, referenceItem: JQuery): kendo.ui.ContextMenu;
        insertBefore(item: Element, referenceItem: string): kendo.ui.ContextMenu;
        insertBefore(item: Element, referenceItem: Element): kendo.ui.ContextMenu;
        insertBefore(item: Element, referenceItem: JQuery): kendo.ui.ContextMenu;
        insertBefore(item: JQuery, referenceItem: string): kendo.ui.ContextMenu;
        insertBefore(item: JQuery, referenceItem: Element): kendo.ui.ContextMenu;
        insertBefore(item: JQuery, referenceItem: JQuery): kendo.ui.ContextMenu;
        open(x: number, y: number): kendo.ui.ContextMenu;
        open(x: Element, y: number): kendo.ui.ContextMenu;
        open(x: JQuery, y: number): kendo.ui.ContextMenu;
        remove(element: string): kendo.ui.ContextMenu;
        remove(element: Element): kendo.ui.ContextMenu;
        remove(element: JQuery): kendo.ui.ContextMenu;
    }

    interface ContextMenuAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface ContextMenuAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface ContextMenuAnimation {
        close?: ContextMenuAnimationClose;
        open?: ContextMenuAnimationOpen;
    }

    interface ContextMenuOptions {
        name?: string;
        alignToAnchor?: boolean;
        animation?: ContextMenuAnimation;
        closeOnClick?: boolean;
        dataSource?: any;
        direction?: string;
        filter?: string;
        hoverDelay?: number;
        orientation?: string;
        popupCollision?: string;
        showOn?: string;
        target?: any;
        close?(e: ContextMenuCloseEvent): void;
        open?(e: ContextMenuOpenEvent): void;
        activate?(e: ContextMenuActivateEvent): void;
        deactivate?(e: ContextMenuDeactivateEvent): void;
        select?(e: ContextMenuSelectEvent): void;
    }

    interface ContextMenuEvent {
        sender: ContextMenu;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ContextMenuCloseEvent extends ContextMenuEvent {
        item?: Element;
    }

    interface ContextMenuOpenEvent extends ContextMenuEvent {
        item?: Element;
    }

    interface ContextMenuActivateEvent extends ContextMenuEvent {
        item?: Element;
    }

    interface ContextMenuDeactivateEvent extends ContextMenuEvent {
        item?: Element;
    }

    interface ContextMenuSelectEvent extends ContextMenuEvent {
        item?: Element;
    }


    class DatePicker extends kendo.ui.Widget {
        static fn: DatePicker;
        static extend(proto: Object): DatePicker;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: DatePickerOptions);
        options: DatePickerOptions;
        close(): void;
        destroy(): void;
        enable(enable: boolean): void;
        readonly(readonly: boolean): void;
        max(): Date;
        max(value: Date): void;
        max(value: string): void;
        min(): Date;
        min(value: Date): void;
        min(value: string): void;
        open(): void;
        setOptions(options: any): void;
        value(): Date;
        value(value: Date): void;
        value(value: string): void;
    }

    interface DatePickerAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface DatePickerAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface DatePickerAnimation {
        close?: DatePickerAnimationClose;
        open?: DatePickerAnimationOpen;
    }

    interface DatePickerMonth {
        content?: string;
        empty?: string;
    }

    interface DatePickerOptions {
        name?: string;
        animation?: DatePickerAnimation;
        ARIATemplate?: string;
        culture?: string;
        dates?: any;
        depth?: string;
        footer?: any;
        format?: string;
        max?: Date;
        min?: Date;
        month?: DatePickerMonth;
        parseFormats?: any;
        start?: string;
        value?: Date;
        change?(e: DatePickerChangeEvent): void;
        close?(e: DatePickerCloseEvent): void;
        open?(e: DatePickerOpenEvent): void;
    }

    interface DatePickerEvent {
        sender: DatePicker;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface DatePickerChangeEvent extends DatePickerEvent {
    }

    interface DatePickerCloseEvent extends DatePickerEvent {
    }

    interface DatePickerOpenEvent extends DatePickerEvent {
    }


    class DateTimePicker extends kendo.ui.Widget {
        static fn: DateTimePicker;
        static extend(proto: Object): DateTimePicker;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: DateTimePickerOptions);
        options: DateTimePickerOptions;
        close(view: string): void;
        destroy(): void;
        enable(enable: boolean): void;
        readonly(readonly: boolean): void;
        max(): Date;
        max(value: Date): void;
        max(value: string): void;
        min(): Date;
        min(value: Date): void;
        min(value: string): void;
        open(view: string): void;
        setOptions(options: any): void;
        toggle(view: string): void;
        value(): Date;
        value(value: Date): void;
        value(value: string): void;
    }

    interface DateTimePickerAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface DateTimePickerAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface DateTimePickerAnimation {
        close?: DateTimePickerAnimationClose;
        open?: DateTimePickerAnimationOpen;
    }

    interface DateTimePickerMonth {
        content?: string;
        empty?: string;
    }

    interface DateTimePickerOptions {
        name?: string;
        animation?: DateTimePickerAnimation;
        ARIATemplate?: string;
        culture?: string;
        dates?: any;
        depth?: string;
        footer?: string;
        format?: string;
        interval?: number;
        max?: Date;
        min?: Date;
        month?: DateTimePickerMonth;
        parseFormats?: any;
        start?: string;
        timeFormat?: string;
        value?: Date;
        change?(e: DateTimePickerChangeEvent): void;
        close?(e: DateTimePickerCloseEvent): void;
        open?(e: DateTimePickerOpenEvent): void;
    }

    interface DateTimePickerEvent {
        sender: DateTimePicker;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface DateTimePickerChangeEvent extends DateTimePickerEvent {
    }

    interface DateTimePickerCloseEvent extends DateTimePickerEvent {
        view?: string;
    }

    interface DateTimePickerOpenEvent extends DateTimePickerEvent {
        view?: string;
    }


    class DropDownList extends kendo.ui.Widget {
        static fn: DropDownList;
        static extend(proto: Object): DropDownList;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: DropDownListOptions);
        options: DropDownListOptions;
        dataSource: kendo.data.DataSource;
        close(): void;
        dataItem(index?: number): any;
        destroy(): void;
        focus(): void;
        open(): void;
        enable(enable: boolean): void;
        readonly(readonly: boolean): void;
        refresh(): void;
        search(word: string): void;
        select(): number;
        select(li: JQuery): void;
        select(li: number): void;
        select(li: Function): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        text(): string;
        text(text: string): void;
        toggle(toggle: boolean): void;
        value(): string;
        value(value: string): void;
        span: JQuery;
        list: JQuery;
        ul: JQuery;
    }

    interface DropDownListAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface DropDownListAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface DropDownListAnimation {
        close?: DropDownListAnimationClose;
        open?: DropDownListAnimationOpen;
    }

    interface DropDownListOptions {
        name?: string;
        animation?: DropDownListAnimation;
        autoBind?: boolean;
        cascadeFrom?: string;
        cascadeFromField?: string;
        dataSource?: any;
        dataTextField?: string;
        dataValueField?: string;
        delay?: number;
        enable?: boolean;
        filter?: string;
        height?: number;
        ignoreCase?: string;
        index?: number;
        minLength?: number;
        optionLabel?: any;
        headerTemplate?: any;
        template?: any;
        valueTemplate?: any;
        text?: string;
        value?: string;
        valuePrimitive?: boolean;
        change?(e: DropDownListChangeEvent): void;
        close?(e: DropDownListCloseEvent): void;
        dataBound?(e: DropDownListDataBoundEvent): void;
        open?(e: DropDownListOpenEvent): void;
        select?(e: DropDownListSelectEvent): void;
        cascade?(e: DropDownListCascadeEvent): void;
    }

    interface DropDownListEvent {
        sender: DropDownList;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface DropDownListChangeEvent extends DropDownListEvent {
    }

    interface DropDownListCloseEvent extends DropDownListEvent {
    }

    interface DropDownListDataBoundEvent extends DropDownListEvent {
    }

    interface DropDownListOpenEvent extends DropDownListEvent {
    }

    interface DropDownListSelectEvent extends DropDownListEvent {
        item?: JQuery;
    }

    interface DropDownListCascadeEvent extends DropDownListEvent {
    }


    class Editor extends kendo.ui.Widget {
        static fn: Editor;
        static extend(proto: Object): Editor;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: EditorOptions);
        options: EditorOptions;
        createRange(document?: Document): Range;
        destroy(): void;
        encodedValue(): void;
        exec(name: string, params: any): void;
        focus(): void;
        getRange(): Range;
        getSelection(): Selection;
        paste(html: string): void;
        selectedHtml(): string;
        refresh(): void;
        selectRange(range: Range): void;
        update(): void;
        state(toolName: string): boolean;
        value(): string;
        value(value: string): void;
        body: Element;
    }

    interface EditorFileBrowserMessages {
        uploadFile?: string;
        orderBy?: string;
        orderByName?: string;
        orderBySize?: string;
        directoryNotFound?: string;
        emptyFolder?: string;
        deleteFile?: string;
        invalidFileType?: string;
        overwriteFile?: string;
        search?: string;
    }

    interface EditorFileBrowserSchemaModelFieldsName {
        field?: string;
        parse?: Function;
    }

    interface EditorFileBrowserSchemaModelFieldsSize {
        field?: string;
        parse?: Function;
    }

    interface EditorFileBrowserSchemaModelFieldsType {
        parse?: Function;
        field?: string;
    }

    interface EditorFileBrowserSchemaModelFields {
        name?: EditorFileBrowserSchemaModelFieldsName;
        type?: EditorFileBrowserSchemaModelFieldsType;
        size?: EditorFileBrowserSchemaModelFieldsSize;
    }

    interface EditorFileBrowserSchemaModel {
        id?: string;
        fields?: EditorFileBrowserSchemaModelFields;
    }

    interface EditorFileBrowserSchema {
    }

    interface EditorFileBrowserTransportCreate {
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface EditorFileBrowserTransportDestroy {
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface EditorFileBrowserTransportRead {
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface EditorFileBrowserTransport {
        read?: EditorFileBrowserTransportRead;
        uploadUrl?: string;
        fileUrl?: any;
        destroy?: EditorFileBrowserTransportDestroy;
        create?: EditorFileBrowserTransportCreate;
    }

    interface EditorFileBrowser {
        fileTypes?: string;
        path?: string;
        transport?: EditorFileBrowserTransport;
        schema?: EditorFileBrowserSchema;
        messages?: EditorFileBrowserMessages;
    }

    interface EditorImageBrowserMessages {
        uploadFile?: string;
        orderBy?: string;
        orderByName?: string;
        orderBySize?: string;
        directoryNotFound?: string;
        emptyFolder?: string;
        deleteFile?: string;
        invalidFileType?: string;
        overwriteFile?: string;
        search?: string;
    }

    interface EditorImageBrowserSchemaModelFieldsName {
        field?: string;
        parse?: Function;
    }

    interface EditorImageBrowserSchemaModelFieldsSize {
        field?: string;
        parse?: Function;
    }

    interface EditorImageBrowserSchemaModelFieldsType {
        parse?: Function;
        field?: string;
    }

    interface EditorImageBrowserSchemaModelFields {
        name?: EditorImageBrowserSchemaModelFieldsName;
        type?: EditorImageBrowserSchemaModelFieldsType;
        size?: EditorImageBrowserSchemaModelFieldsSize;
    }

    interface EditorImageBrowserSchemaModel {
        id?: string;
        fields?: EditorImageBrowserSchemaModelFields;
    }

    interface EditorImageBrowserSchema {
    }

    interface EditorImageBrowserTransportCreate {
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface EditorImageBrowserTransportDestroy {
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface EditorImageBrowserTransportRead {
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface EditorImageBrowserTransport {
        read?: EditorImageBrowserTransportRead;
        thumbnailUrl?: any;
        uploadUrl?: string;
        imageUrl?: any;
        destroy?: EditorImageBrowserTransportDestroy;
        create?: EditorImageBrowserTransportCreate;
    }

    interface EditorImageBrowser {
        fileTypes?: string;
        path?: string;
        transport?: EditorImageBrowserTransport;
        schema?: EditorImageBrowserSchema;
        messages?: EditorImageBrowserMessages;
    }

    interface EditorSerialization {
        entities?: boolean;
    }

    interface EditorToolItem {
        text?: string;
        value?: string;
        context?: string;
    }

    interface EditorTool {
        name?: string;
        tooltip?: string;
        exec?: Function;
        items?: EditorToolItem[];
        template?: string;
    }

    interface EditorExecParams {
        value?: any;
    }

    interface EditorOptions {
        name?: string;
        domain?: string;
        encoded?: boolean;
        messages?: any;
        serialization?: EditorSerialization;
        stylesheets?: any;
        tools?: EditorTool[];
        imageBrowser?: EditorImageBrowser;
        fileBrowser?: EditorFileBrowser;
        change?(e: EditorEvent): void;
        execute?(e: EditorExecuteEvent): void;
        keydown?(e: EditorEvent): void;
        keyup?(e: EditorEvent): void;
        paste?(e: EditorPasteEvent): void;
        select?(e: EditorEvent): void;
    }

    interface EditorEvent {
        sender: Editor;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface EditorExecuteEvent extends EditorEvent {
        name?: string;
        command?: any;
    }

    interface EditorPasteEvent extends EditorEvent {
        html?: any;
    }


    class FlatColorPicker extends kendo.ui.Widget {
        static fn: FlatColorPicker;
        static extend(proto: Object): FlatColorPicker;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: FlatColorPickerOptions);
        options: FlatColorPickerOptions;
        focus(): void;
        value(): string;
        value(color?: string): void;
        color(): kendo.Color;
        color(color?: kendo.Color): void;
        enable(enable?: boolean): void;
    }

    interface FlatColorPickerOptions {
        name?: string;
        opacity?: boolean;
        buttons?: boolean;
        value?: string;
        preview?: boolean;
        autoupdate?: boolean;
        messages?: any;
        change?(e: FlatColorPickerChangeEvent): void;
    }

    interface FlatColorPickerEvent {
        sender: FlatColorPicker;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface FlatColorPickerChangeEvent extends FlatColorPickerEvent {
        value?: string;
    }


    class Gantt extends kendo.ui.Widget {
        static fn: Gantt;
        static extend(proto: Object): Gantt;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: GanttOptions);
        options: GanttOptions;
        dataSource: kendo.data.DataSource;
        clearSelection(): void;
        dataItem(row: string): kendo.data.GanttTask;
        dataItem(row: Element): kendo.data.GanttTask;
        dataItem(row: JQuery): kendo.data.GanttTask;
        destroy(): void;
        refresh(): void;
        refreshDependencies(): void;
        removeDependency(dependency: string): void;
        removeDependency(dependency: kendo.data.GanttDependency): void;
        removeTask(task: string): void;
        removeTask(task: kendo.data.GanttTask): void;
        select(): JQuery;
        select(row: string): void;
        select(row: Element): void;
        select(row: JQuery): void;
        setDataSource(dataSource: kendo.data.GanttDataSource): void;
        setDependenciesDataSource(dataSource: kendo.data.GanttDependencyDataSource): void;
        view(): kendo.ui.GanttView;
        view(type?: string): void;
        dependencies: kendo.data.GanttDependencyDataSource;
    }

    interface GanttColumn {
        field?: string;
        title?: string;
        format?: string;
        width?: any;
        editable?: boolean;
        sortable?: boolean;
    }

    interface GanttMessagesActions {
        append?: string;
        addChild?: string;
        insertBefore?: string;
        insertAfter?: string;
    }

    interface GanttMessagesViews {
        day?: string;
        week?: string;
        month?: string;
    }

    interface GanttMessages {
        views?: GanttMessagesViews;
        actions?: GanttMessagesActions;
    }

    interface GanttView {
        type?: string;
        selected?: boolean;
        slotSize?: any;
        timeHeaderTemplate?: any;
        dayHeaderTemplate?: any;
        weekHeaderTemplate?: any;
        monthHeaderTemplate?: any;
    }

    interface GanttOptions {
        name?: string;
        autoBind?: boolean;
        columns?: GanttColumn[];
        dataSource?: any;
        dependencies?: any;
        editable?: boolean;
        navigatable?: boolean;
        workDayStart?: Date;
        workDayEnd?: Date;
        workWeekStart?: number;
        workWeekEnd?: number;
        hourSpan?: number;
        snap?: boolean;
        height?: any;
        listWidth?: any;
        messages?: GanttMessages;
        selectable?: boolean;
        showWorkDays?: boolean;
        showWorkHours?: boolean;
        views?: GanttView[];
        dataBinding?(e: GanttDataBindingEvent): void;
        dataBound?(e: GanttDataBoundEvent): void;
        add?(e: GanttAddEvent): void;
        edit?(e: GanttEditEvent): void;
        remove?(e: GanttRemoveEvent): void;
        cancel?(e: GanttCancelEvent): void;
        save?(e: GanttSaveEvent): void;
        change?(e: GanttChangeEvent): void;
        navigate?(e: GanttNavigateEvent): void;
        moveStart?(e: GanttMoveStartEvent): void;
        move?(e: GanttMoveEvent): void;
        moveEnd?(e: GanttMoveEndEvent): void;
        resizeStart?(e: GanttResizeStartEvent): void;
        resize?(e: GanttResizeEvent): void;
        resizeEnd?(e: GanttResizeEndEvent): void;
    }

    interface GanttEvent {
        sender: Gantt;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface GanttDataBindingEvent extends GanttEvent {
    }

    interface GanttDataBoundEvent extends GanttEvent {
    }

    interface GanttAddEvent extends GanttEvent {
        task?: kendo.data.GanttTask;
        dependency?: kendo.data.GanttDependency;
    }

    interface GanttEditEvent extends GanttEvent {
        container?: JQuery;
        task?: kendo.data.GanttTask;
    }

    interface GanttRemoveEvent extends GanttEvent {
        task?: kendo.data.GanttTask;
        dependencies?: any;
    }

    interface GanttCancelEvent extends GanttEvent {
        container?: JQuery;
        task?: kendo.data.GanttTask;
    }

    interface GanttSaveEvent extends GanttEvent {
        task?: kendo.data.GanttTask;
        value?: any;
    }

    interface GanttChangeEvent extends GanttEvent {
    }

    interface GanttNavigateEvent extends GanttEvent {
        view?: string;
    }

    interface GanttMoveStartEvent extends GanttEvent {
        task?: kendo.data.GanttTask;
    }

    interface GanttMoveEvent extends GanttEvent {
        task?: kendo.data.GanttTask;
        start?: Date;
        end?: Date;
    }

    interface GanttMoveEndEvent extends GanttEvent {
        task?: kendo.data.GanttTask;
        start?: Date;
        end?: Date;
    }

    interface GanttResizeStartEvent extends GanttEvent {
        task?: kendo.data.GanttTask;
    }

    interface GanttResizeEvent extends GanttEvent {
        task?: kendo.data.GanttTask;
        start?: Date;
        end?: Date;
    }

    interface GanttResizeEndEvent extends GanttEvent {
        task?: kendo.data.GanttTask;
        start?: Date;
        end?: Date;
    }


    class Grid extends kendo.ui.Widget {
        static fn: Grid;
        static extend(proto: Object): Grid;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: GridOptions);
        options: GridOptions;
        dataSource: kendo.data.DataSource;
        addRow(): void;
        cancelChanges(): void;
        cancelRow(): void;
        cellIndex(cell: string): number;
        cellIndex(cell: Element): number;
        cellIndex(cell: JQuery): number;
        clearSelection(): void;
        closeCell(isCancel?: boolean): void;
        collapseGroup(row: string): void;
        collapseGroup(row: Element): void;
        collapseGroup(row: JQuery): void;
        collapseRow(row: string): void;
        collapseRow(row: Element): void;
        collapseRow(row: JQuery): void;
        current(): JQuery;
        current(cell: JQuery): void;
        dataItem(row: string): kendo.data.ObservableObject;
        dataItem(row: Element): kendo.data.ObservableObject;
        dataItem(row: JQuery): kendo.data.ObservableObject;
        destroy(): void;
        editCell(cell: JQuery): void;
        editRow(row: JQuery): void;
        expandGroup(row: string): void;
        expandGroup(row: Element): void;
        expandGroup(row: JQuery): void;
        expandRow(row: string): void;
        expandRow(row: Element): void;
        expandRow(row: JQuery): void;
        hideColumn(column: number): void;
        hideColumn(column: string): void;
        refresh(): void;
        removeRow(row: string): void;
        removeRow(row: Element): void;
        removeRow(row: JQuery): void;
        reorderColumn(destIndex: number, column: any): void;
        saveChanges(): void;
        saveRow(): void;
        select(): JQuery;
        select(rows: string): void;
        select(rows: Element): void;
        select(rows: JQuery): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        showColumn(column: number): void;
        showColumn(column: string): void;
        columns: GridColumn[];
        footer: JQuery;
        pager: kendo.ui.Pager;
        table: JQuery;
        tbody: JQuery;
        thead: JQuery;
    }

    interface GridColumnMenuMessages {
        columns?: string;
        filter?: string;
        sortAscending?: string;
        sortDescending?: string;
        settings?: string;
        done?: string;
        lock?: string;
        unlock?: string;
    }

    interface GridColumnMenu {
        columns?: boolean;
        filterable?: boolean;
        sortable?: boolean;
        messages?: GridColumnMenuMessages;
    }

    interface GridColumnCommandItem {
        name?: string;
        text?: string;
        className?: string;
        click?: Function;
    }

    interface GridColumnFilterableCell {
        dataSource?: any;
        dataTextField?: string;
        delay?: number;
        enabled?: boolean;
        operator?: string;
        showOperators?: boolean;
        template?: Function;
    }

    interface GridColumnFilterable {
        cell?: GridColumnFilterableCell;
        ui?: any;
    }

    interface GridColumnSortable {
        compare?: Function;
    }

    interface GridColumn {
        aggregates?: any;
        attributes?: any;
        command?: GridColumnCommandItem[];
        encoded?: boolean;
        field?: string;
        filterable?: GridColumnFilterable;
        footerTemplate?: any;
        format?: string;
        groupable?: boolean;
        groupHeaderTemplate?: any;
        groupFooterTemplate?: any;
        headerAttributes?: any;
        headerTemplate?: any;
        hidden?: boolean;
        locked?: boolean;
        lockable?: boolean;
        sortable?: GridColumnSortable;
        template?: any;
        title?: string;
        width?: any;
        values?: any;
        menu?: boolean;
    }

    interface GridEditable {
        confirmation?: any;
        cancelDelete?: string;
        confirmDelete?: string;
        createAt?: string;
        destroy?: boolean;
        mode?: string;
        template?: any;
        update?: boolean;
        window?: any;
    }

    interface GridFilterableMessages {
        and?: string;
        clear?: string;
        filter?: string;
        info?: string;
        isFalse?: string;
        isTrue?: string;
        or?: string;
        selectValue?: string;
        cancel?: string;
        operator?: string;
        value?: string;
    }

    interface GridFilterableOperatorsDate {
        eq?: string;
        neq?: string;
        gte?: string;
        gt?: string;
        lte?: string;
        lt?: string;
    }

    interface GridFilterableOperatorsEnums {
        eq?: string;
        neq?: string;
    }

    interface GridFilterableOperatorsNumber {
        eq?: string;
        neq?: string;
        gte?: string;
        gt?: string;
        lte?: string;
        lt?: string;
    }

    interface GridFilterableOperatorsString {
        eq?: string;
        neq?: string;
        startswith?: string;
        contains?: string;
        doesnotcontain?: string;
        endswith?: string;
    }

    interface GridFilterableOperators {
        string?: GridFilterableOperatorsString;
        number?: GridFilterableOperatorsNumber;
        date?: GridFilterableOperatorsDate;
        enums?: GridFilterableOperatorsEnums;
    }

    interface GridFilterable {
        extra?: boolean;
        messages?: GridFilterableMessages;
        operators?: GridFilterableOperators;
        mode?: string;
    }

    interface GridGroupableMessages {
        empty?: string;
    }

    interface GridGroupable {
        messages?: GridGroupableMessages;
    }

    interface GridMessagesCommands {
        cancel?: string;
        canceledit?: string;
        create?: string;
        destroy?: string;
        edit?: string;
        save?: string;
        update?: string;
    }

    interface GridMessages {
        commands?: GridMessagesCommands;
    }

    interface GridPageableMessages {
        display?: string;
        empty?: string;
        page?: string;
        of?: string;
        itemsPerPage?: string;
        first?: string;
        last?: string;
        next?: string;
        previous?: string;
        refresh?: string;
        morePages?: string;
    }

    interface GridPageable {
        pageSize?: number;
        previousNext?: boolean;
        numeric?: boolean;
        buttonCount?: number;
        input?: boolean;
        pageSizes?: any;
        refresh?: boolean;
        info?: boolean;
        messages?: GridPageableMessages;
    }

    interface GridScrollable {
        virtual?: boolean;
    }

    interface GridSortable {
        allowUnsort?: boolean;
        mode?: string;
    }

    interface GridToolbarItem {
        name?: string;
        template?: any;
        text?: string;
    }

    interface GridOptions {
        name?: string;
        altRowTemplate?: any;
        autoBind?: boolean;
        columnResizeHandleWidth?: number;
        columns?: GridColumn[];
        columnMenu?: GridColumnMenu;
        dataSource?: any;
        detailTemplate?: any;
        editable?: GridEditable;
        filterable?: GridFilterable;
        groupable?: GridGroupable;
        height?: any;
        messages?: GridMessages;
        mobile?: any;
        navigatable?: boolean;
        pageable?: GridPageable;
        reorderable?: boolean;
        resizable?: boolean;
        rowTemplate?: any;
        scrollable?: GridScrollable;
        selectable?: any;
        sortable?: GridSortable;
        toolbar?: GridToolbarItem[];
        cancel?(e: GridCancelEvent): void;
        change?(e: GridChangeEvent): void;
        columnHide?(e: GridColumnHideEvent): void;
        columnMenuInit?(e: GridColumnMenuInitEvent): void;
        columnReorder?(e: GridColumnReorderEvent): void;
        columnResize?(e: GridColumnResizeEvent): void;
        columnShow?(e: GridColumnShowEvent): void;
        dataBinding?(e: GridDataBindingEvent): void;
        dataBound?(e: GridDataBoundEvent): void;
        detailCollapse?(e: GridDetailCollapseEvent): void;
        detailExpand?(e: GridDetailExpandEvent): void;
        detailInit?(e: GridDetailInitEvent): void;
        edit?(e: GridEditEvent): void;
        filterMenuInit?(e: GridFilterMenuInitEvent): void;
        remove?(e: GridRemoveEvent): void;
        save?(e: GridSaveEvent): void;
        saveChanges?(e: GridSaveChangesEvent): void;
        columnLock?(e: GridColumnLockEvent): void;
        columnUnlock?(e: GridColumnUnlockEvent): void;
    }

    interface GridEvent {
        sender: Grid;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface GridCancelEvent extends GridEvent {
        container?: JQuery;
        model?: kendo.data.Model;
    }

    interface GridChangeEvent extends GridEvent {
    }

    interface GridColumnHideEvent extends GridEvent {
        column?: any;
    }

    interface GridColumnMenuInitEvent extends GridEvent {
        container?: JQuery;
        field?: string;
    }

    interface GridColumnReorderEvent extends GridEvent {
        column?: any;
        newIndex?: number;
        oldIndex?: number;
    }

    interface GridColumnResizeEvent extends GridEvent {
        column?: any;
        newWidth?: number;
        oldWidth?: number;
    }

    interface GridColumnShowEvent extends GridEvent {
        column?: any;
    }

    interface GridDataBindingEvent extends GridEvent {
    }

    interface GridDataBoundEvent extends GridEvent {
    }

    interface GridDetailCollapseEvent extends GridEvent {
        detailRow?: JQuery;
        masterRow?: JQuery;
    }

    interface GridDetailExpandEvent extends GridEvent {
        detailRow?: JQuery;
        masterRow?: JQuery;
    }

    interface GridDetailInitEvent extends GridEvent {
        data?: kendo.data.ObservableObject;
        detailCell?: JQuery;
        detailRow?: JQuery;
        masterRow?: JQuery;
    }

    interface GridEditEvent extends GridEvent {
        container?: JQuery;
        model?: kendo.data.Model;
    }

    interface GridFilterMenuInitEvent extends GridEvent {
        container?: JQuery;
        field?: string;
    }

    interface GridRemoveEvent extends GridEvent {
        model?: kendo.data.Model;
        row?: JQuery;
    }

    interface GridSaveEvent extends GridEvent {
        model?: kendo.data.Model;
        container?: JQuery;
        values?: any;
    }

    interface GridSaveChangesEvent extends GridEvent {
    }

    interface GridColumnLockEvent extends GridEvent {
        column?: any;
    }

    interface GridColumnUnlockEvent extends GridEvent {
        column?: any;
    }


    class ListView extends kendo.ui.Widget {
        static fn: ListView;
        static extend(proto: Object): ListView;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ListViewOptions);
        options: ListViewOptions;
        dataSource: kendo.data.DataSource;
        add(): void;
        cancel(): void;
        clearSelection(): void;
        destroy(): void;
        edit(item: JQuery): void;
        refresh(): void;
        remove(item: any): void;
        save(): void;
        select(): JQuery;
        select(items: JQuery): void;
        select(items: any): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
    }

    interface ListViewOptions {
        name?: string;
        autoBind?: boolean;
        dataSource?: any;
        editTemplate?: Function;
        navigatable?: boolean;
        selectable?: any;
        template?: Function;
        altTemplate?: Function;
        cancel?(e: ListViewCancelEvent): void;
        change?(e: ListViewEvent): void;
        dataBound?(e: ListViewEvent): void;
        dataBinding?(e: ListViewEvent): void;
        edit?(e: ListViewEditEvent): void;
        remove?(e: ListViewRemoveEvent): void;
        save?(e: ListViewSaveEvent): void;
    }

    interface ListViewEvent {
        sender: ListView;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ListViewCancelEvent extends ListViewEvent {
        container?: JQuery;
        model?: kendo.data.Model;
    }

    interface ListViewEditEvent extends ListViewEvent {
        item?: JQuery;
        model?: kendo.data.Model;
    }

    interface ListViewRemoveEvent extends ListViewEvent {
        item?: JQuery;
        model?: kendo.data.Model;
    }

    interface ListViewSaveEvent extends ListViewEvent {
        model?: kendo.data.Model;
        item?: JQuery;
    }


    class MaskedTextBox extends kendo.ui.Widget {
        static fn: MaskedTextBox;
        static extend(proto: Object): MaskedTextBox;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: MaskedTextBoxOptions);
        options: MaskedTextBoxOptions;
        destroy(): void;
        enable(enable: boolean): void;
        readonly(readonly: boolean): void;
        value(): string;
        value(value: string): void;
    }

    interface MaskedTextBoxOptions {
        name?: string;
        culture?: string;
        mask?: string;
        promptChar?: string;
        rules?: any;
        value?: string;
        change?(e: MaskedTextBoxChangeEvent): void;
    }

    interface MaskedTextBoxEvent {
        sender: MaskedTextBox;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface MaskedTextBoxChangeEvent extends MaskedTextBoxEvent {
    }


    class Menu extends kendo.ui.Widget {
        static fn: Menu;
        static extend(proto: Object): Menu;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: MenuOptions);
        options: MenuOptions;
        append(item: any, referenceItem: string): kendo.ui.Menu;
        append(item: any, referenceItem: JQuery): kendo.ui.Menu;
        close(element: string): kendo.ui.Menu;
        close(element: Element): kendo.ui.Menu;
        close(element: JQuery): kendo.ui.Menu;
        destroy(): void;
        enable(element: string, enable: boolean): kendo.ui.Menu;
        enable(element: Element, enable: boolean): kendo.ui.Menu;
        enable(element: JQuery, enable: boolean): kendo.ui.Menu;
        insertAfter(item: string, referenceItem: string): kendo.ui.Menu;
        insertAfter(item: string, referenceItem: Element): kendo.ui.Menu;
        insertAfter(item: string, referenceItem: JQuery): kendo.ui.Menu;
        insertAfter(item: Element, referenceItem: string): kendo.ui.Menu;
        insertAfter(item: Element, referenceItem: Element): kendo.ui.Menu;
        insertAfter(item: Element, referenceItem: JQuery): kendo.ui.Menu;
        insertAfter(item: JQuery, referenceItem: string): kendo.ui.Menu;
        insertAfter(item: JQuery, referenceItem: Element): kendo.ui.Menu;
        insertAfter(item: JQuery, referenceItem: JQuery): kendo.ui.Menu;
        insertBefore(item: string, referenceItem: string): kendo.ui.Menu;
        insertBefore(item: string, referenceItem: Element): kendo.ui.Menu;
        insertBefore(item: string, referenceItem: JQuery): kendo.ui.Menu;
        insertBefore(item: Element, referenceItem: string): kendo.ui.Menu;
        insertBefore(item: Element, referenceItem: Element): kendo.ui.Menu;
        insertBefore(item: Element, referenceItem: JQuery): kendo.ui.Menu;
        insertBefore(item: JQuery, referenceItem: string): kendo.ui.Menu;
        insertBefore(item: JQuery, referenceItem: Element): kendo.ui.Menu;
        insertBefore(item: JQuery, referenceItem: JQuery): kendo.ui.Menu;
        open(element: string): kendo.ui.Menu;
        open(element: Element): kendo.ui.Menu;
        open(element: JQuery): kendo.ui.Menu;
        remove(element: string): kendo.ui.Menu;
        remove(element: Element): kendo.ui.Menu;
        remove(element: JQuery): kendo.ui.Menu;
    }

    interface MenuAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface MenuAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface MenuAnimation {
        close?: MenuAnimationClose;
        open?: MenuAnimationOpen;
    }

    interface MenuOptions {
        name?: string;
        animation?: MenuAnimation;
        closeOnClick?: boolean;
        dataSource?: any;
        direction?: string;
        hoverDelay?: number;
        openOnClick?: boolean;
        orientation?: string;
        popupCollision?: string;
        close?(e: MenuCloseEvent): void;
        open?(e: MenuOpenEvent): void;
        activate?(e: MenuActivateEvent): void;
        deactivate?(e: MenuDeactivateEvent): void;
        select?(e: MenuSelectEvent): void;
    }

    interface MenuEvent {
        sender: Menu;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface MenuCloseEvent extends MenuEvent {
        item?: Element;
    }

    interface MenuOpenEvent extends MenuEvent {
        item?: Element;
    }

    interface MenuActivateEvent extends MenuEvent {
        item?: Element;
    }

    interface MenuDeactivateEvent extends MenuEvent {
        item?: Element;
    }

    interface MenuSelectEvent extends MenuEvent {
        item?: Element;
    }


    class MultiSelect extends kendo.ui.Widget {
        static fn: MultiSelect;
        static extend(proto: Object): MultiSelect;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: MultiSelectOptions);
        options: MultiSelectOptions;
        dataSource: kendo.data.DataSource;
        close(): void;
        dataItems(): any;
        destroy(): void;
        enable(enable: boolean): void;
        readonly(readonly: boolean): void;
        focus(): void;
        open(): void;
        refresh(): void;
        search(word: string): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        toggle(toggle: boolean): void;
        value(): any;
        value(value: any): void;
        value(value: string): void;
        input: JQuery;
        list: JQuery;
        ul: JQuery;
        tagList: JQuery;
    }

    interface MultiSelectAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface MultiSelectAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface MultiSelectAnimation {
        close?: MultiSelectAnimationClose;
        open?: MultiSelectAnimationOpen;
    }

    interface MultiSelectOptions {
        name?: string;
        animation?: MultiSelectAnimation;
        autoBind?: boolean;
        autoClose?: boolean;
        dataSource?: any;
        dataTextField?: string;
        dataValueField?: string;
        delay?: number;
        enable?: boolean;
        filter?: string;
        height?: number;
        highlightFirst?: boolean;
        ignoreCase?: string;
        minLength?: number;
        maxSelectedItems?: number;
        placeholder?: string;
        headerTemplate?: any;
        itemTemplate?: any;
        tagTemplate?: string;
        value?: any;
        valuePrimitive?: boolean;
        change?(e: MultiSelectChangeEvent): void;
        close?(e: MultiSelectCloseEvent): void;
        dataBound?(e: MultiSelectDataBoundEvent): void;
        open?(e: MultiSelectOpenEvent): void;
        select?(e: MultiSelectSelectEvent): void;
    }

    interface MultiSelectEvent {
        sender: MultiSelect;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface MultiSelectChangeEvent extends MultiSelectEvent {
    }

    interface MultiSelectCloseEvent extends MultiSelectEvent {
    }

    interface MultiSelectDataBoundEvent extends MultiSelectEvent {
    }

    interface MultiSelectOpenEvent extends MultiSelectEvent {
    }

    interface MultiSelectSelectEvent extends MultiSelectEvent {
        item?: JQuery;
    }


    class Notification extends kendo.ui.Widget {
        static fn: Notification;
        static extend(proto: Object): Notification;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: NotificationOptions);
        options: NotificationOptions;
        error(): void;
        getNotifications(): void;
        hide(): void;
        info(): void;
        show(data: any, type: string): void;
        show(data: string, type: string): void;
        show(data: Function, type: string): void;
        success(): void;
        warning(): void;
    }

    interface NotificationPosition {
        bottom?: number;
        left?: number;
        pinned?: boolean;
        right?: number;
        top?: number;
    }

    interface NotificationTemplate {
        type?: string;
        template?: string;
    }

    interface NotificationOptions {
        name?: string;
        allowHideAfter?: number;
        animation?: any;
        appendTo?: any;
        autoHideAfter?: number;
        button?: boolean;
        height?: any;
        hideOnClick?: boolean;
        position?: NotificationPosition;
        stacking?: string;
        templates?: NotificationTemplate[];
        width?: any;
        hide?(e: NotificationHideEvent): void;
        show?(e: NotificationShowEvent): void;
    }

    interface NotificationEvent {
        sender: Notification;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface NotificationHideEvent extends NotificationEvent {
        element?: JQuery;
    }

    interface NotificationShowEvent extends NotificationEvent {
        element?: JQuery;
    }


    class NumericTextBox extends kendo.ui.Widget {
        static fn: NumericTextBox;
        static extend(proto: Object): NumericTextBox;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: NumericTextBoxOptions);
        options: NumericTextBoxOptions;
        destroy(): void;
        enable(enable: boolean): void;
        readonly(readonly: boolean): void;
        focus(): void;
        max(): number;
        max(value: number): void;
        max(value: string): void;
        min(): number;
        min(value: number): void;
        min(value: string): void;
        step(): number;
        step(value: number): void;
        step(value: string): void;
        value(): number;
        value(value: number): void;
        value(value: string): void;
    }

    interface NumericTextBoxOptions {
        name?: string;
        culture?: string;
        decimals?: number;
        downArrowText?: string;
        format?: string;
        max?: number;
        min?: number;
        placeholder?: string;
        spinners?: boolean;
        step?: number;
        upArrowText?: string;
        value?: number;
        change?(e: NumericTextBoxChangeEvent): void;
        spin?(e: NumericTextBoxSpinEvent): void;
    }

    interface NumericTextBoxEvent {
        sender: NumericTextBox;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface NumericTextBoxChangeEvent extends NumericTextBoxEvent {
    }

    interface NumericTextBoxSpinEvent extends NumericTextBoxEvent {
    }


    class Pager extends kendo.ui.Widget {
        static fn: Pager;
        static extend(proto: Object): Pager;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: PagerOptions);
        options: PagerOptions;
        dataSource: kendo.data.DataSource;
        totalPages(): number;
        pageSize(): number;
        page(page: boolean): number;
        refresh(): void;
        destroy(): void;
    }

    interface PagerMessages {
        display?: string;
        empty?: string;
        page?: string;
        of?: string;
        itemsPerPage?: string;
        first?: string;
        previous?: string;
        next?: string;
        last?: string;
        refresh?: string;
    }

    interface PagerOptions {
        name?: string;
        autoBind?: boolean;
        buttonCount?: number;
        dataSource?: any;
        selectTemplate?: string;
        linkTemplate?: string;
        info?: boolean;
        input?: boolean;
        numeric?: boolean;
        pageSizes?: any;
        previousNext?: boolean;
        refresh?: boolean;
        messages?: PagerMessages;
        change?(e: PagerChangeEvent): void;
    }

    interface PagerEvent {
        sender: Pager;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface PagerChangeEvent extends PagerEvent {
    }


    class PanelBar extends kendo.ui.Widget {
        static fn: PanelBar;
        static extend(proto: Object): PanelBar;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: PanelBarOptions);
        options: PanelBarOptions;
        append(item: string, referenceItem: string): kendo.ui.PanelBar;
        append(item: string, referenceItem: Element): kendo.ui.PanelBar;
        append(item: string, referenceItem: JQuery): kendo.ui.PanelBar;
        append(item: Element, referenceItem: string): kendo.ui.PanelBar;
        append(item: Element, referenceItem: Element): kendo.ui.PanelBar;
        append(item: Element, referenceItem: JQuery): kendo.ui.PanelBar;
        append(item: JQuery, referenceItem: string): kendo.ui.PanelBar;
        append(item: JQuery, referenceItem: Element): kendo.ui.PanelBar;
        append(item: JQuery, referenceItem: JQuery): kendo.ui.PanelBar;
        append(item: any, referenceItem: string): kendo.ui.PanelBar;
        append(item: any, referenceItem: Element): kendo.ui.PanelBar;
        append(item: any, referenceItem: JQuery): kendo.ui.PanelBar;
        clearSelection(): void;
        collapse(element: string, useAnimation: boolean): kendo.ui.PanelBar;
        collapse(element: Element, useAnimation: boolean): kendo.ui.PanelBar;
        collapse(element: JQuery, useAnimation: boolean): kendo.ui.PanelBar;
        destroy(): void;
        enable(element: string, enable: boolean): void;
        enable(element: Element, enable: boolean): void;
        enable(element: JQuery, enable: boolean): void;
        expand(element: string, useAnimation: boolean): kendo.ui.PanelBar;
        expand(element: Element, useAnimation: boolean): kendo.ui.PanelBar;
        expand(element: JQuery, useAnimation: boolean): kendo.ui.PanelBar;
        insertAfter(item: string, referenceItem: string): void;
        insertAfter(item: string, referenceItem: Element): void;
        insertAfter(item: string, referenceItem: JQuery): void;
        insertAfter(item: Element, referenceItem: string): void;
        insertAfter(item: Element, referenceItem: Element): void;
        insertAfter(item: Element, referenceItem: JQuery): void;
        insertAfter(item: JQuery, referenceItem: string): void;
        insertAfter(item: JQuery, referenceItem: Element): void;
        insertAfter(item: JQuery, referenceItem: JQuery): void;
        insertAfter(item: any, referenceItem: string): void;
        insertAfter(item: any, referenceItem: Element): void;
        insertAfter(item: any, referenceItem: JQuery): void;
        insertBefore(item: string, referenceItem: string): kendo.ui.PanelBar;
        insertBefore(item: string, referenceItem: Element): kendo.ui.PanelBar;
        insertBefore(item: string, referenceItem: JQuery): kendo.ui.PanelBar;
        insertBefore(item: Element, referenceItem: string): kendo.ui.PanelBar;
        insertBefore(item: Element, referenceItem: Element): kendo.ui.PanelBar;
        insertBefore(item: Element, referenceItem: JQuery): kendo.ui.PanelBar;
        insertBefore(item: JQuery, referenceItem: string): kendo.ui.PanelBar;
        insertBefore(item: JQuery, referenceItem: Element): kendo.ui.PanelBar;
        insertBefore(item: JQuery, referenceItem: JQuery): kendo.ui.PanelBar;
        insertBefore(item: any, referenceItem: string): kendo.ui.PanelBar;
        insertBefore(item: any, referenceItem: Element): kendo.ui.PanelBar;
        insertBefore(item: any, referenceItem: JQuery): kendo.ui.PanelBar;
        reload(element: string): void;
        reload(element: Element): void;
        reload(element: JQuery): void;
        remove(element: string): void;
        remove(element: Element): void;
        remove(element: JQuery): void;
        select(): JQuery;
        select(element?: string): void;
        select(element?: Element): void;
        select(element?: JQuery): void;
    }

    interface PanelBarAnimationCollapse {
        duration?: number;
        effects?: string;
    }

    interface PanelBarAnimationExpand {
        duration?: number;
        effects?: string;
    }

    interface PanelBarAnimation {
        collapse?: PanelBarAnimationCollapse;
        expand?: PanelBarAnimationExpand;
    }

    interface PanelBarOptions {
        name?: string;
        animation?: PanelBarAnimation;
        contentUrls?: any;
        dataSource?: any;
        expandMode?: string;
        activate?(e: PanelBarActivateEvent): void;
        collapse?(e: PanelBarCollapseEvent): void;
        contentLoad?(e: PanelBarContentLoadEvent): void;
        error?(e: PanelBarErrorEvent): void;
        expand?(e: PanelBarExpandEvent): void;
        select?(e: PanelBarSelectEvent): void;
    }

    interface PanelBarEvent {
        sender: PanelBar;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface PanelBarActivateEvent extends PanelBarEvent {
        item?: Element;
    }

    interface PanelBarCollapseEvent extends PanelBarEvent {
        item?: Element;
    }

    interface PanelBarContentLoadEvent extends PanelBarEvent {
        item?: Element;
        contentElement?: Element;
    }

    interface PanelBarErrorEvent extends PanelBarEvent {
        xhr?: JQueryXHR;
        status?: string;
    }

    interface PanelBarExpandEvent extends PanelBarEvent {
        item?: Element;
    }

    interface PanelBarSelectEvent extends PanelBarEvent {
        item?: Element;
    }


    class PivotConfigurator extends kendo.ui.Widget {
        static fn: PivotConfigurator;
        static extend(proto: Object): PivotConfigurator;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: PivotConfiguratorOptions);
        options: PivotConfiguratorOptions;
        dataSource: kendo.data.DataSource;
        destroy(): void;
        refresh(): void;
        setDataSource(dataSource: kendo.data.PivotDataSource): void;
    }

    interface PivotConfiguratorMessagesFieldMenuOperators {
        contains?: string;
        doesnotcontain?: string;
        startswith?: string;
        endswith?: string;
        eq?: string;
        neq?: string;
    }

    interface PivotConfiguratorMessagesFieldMenu {
        info?: string;
        filterFields?: string;
        filter?: string;
        include?: string;
        title?: string;
        clear?: string;
        ok?: string;
        cancel?: string;
        operators?: PivotConfiguratorMessagesFieldMenuOperators;
    }

    interface PivotConfiguratorMessages {
        measures?: string;
        columns?: string;
        rows?: string;
        measuresLabel?: string;
        rowsLabel?: string;
        columnsLabel?: string;
        fieldsLabel?: string;
        fieldMenu?: PivotConfiguratorMessagesFieldMenu;
    }

    interface PivotConfiguratorOptions {
        name?: string;
        dataSource?: any;
        filterable?: boolean;
        messages?: PivotConfiguratorMessages;
    }

    interface PivotConfiguratorEvent {
        sender: PivotConfigurator;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class PivotGrid extends kendo.ui.Widget {
        static fn: PivotGrid;
        static extend(proto: Object): PivotGrid;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: PivotGridOptions);
        options: PivotGridOptions;
        dataSource: kendo.data.DataSource;
        destroy(): void;
        refresh(): void;
        setDataSource(dataSource: kendo.data.PivotDataSource): void;
    }

    interface PivotGridMessagesFieldMenuOperators {
        contains?: string;
        doesnotcontain?: string;
        startswith?: string;
        endswith?: string;
        eq?: string;
        neq?: string;
    }

    interface PivotGridMessagesFieldMenu {
        info?: string;
        filterFields?: string;
        filter?: string;
        include?: string;
        title?: string;
        clear?: string;
        ok?: string;
        cancel?: string;
        operators?: PivotGridMessagesFieldMenuOperators;
    }

    interface PivotGridMessages {
        measureFields?: string;
        columnFields?: string;
        rowFields?: string;
        fieldMenu?: PivotGridMessagesFieldMenu;
    }

    interface PivotGridOptions {
        name?: string;
        dataSource?: any;
        autoBind?: boolean;
        reorderable?: boolean;
        filterable?: boolean;
        columnWidth?: number;
        height?: any;
        messages?: PivotGridMessages;
        dataBinding?(e: PivotGridDataBindingEvent): void;
        dataBound?(e: PivotGridDataBoundEvent): void;
        expandMember?(e: PivotGridExpandMemberEvent): void;
        collapseMember?(e: PivotGridCollapseMemberEvent): void;
    }

    interface PivotGridEvent {
        sender: PivotGrid;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface PivotGridDataBindingEvent extends PivotGridEvent {
    }

    interface PivotGridDataBoundEvent extends PivotGridEvent {
    }

    interface PivotGridExpandMemberEvent extends PivotGridEvent {
        axis?: string;
        path?: string;
    }

    interface PivotGridCollapseMemberEvent extends PivotGridEvent {
        axis?: string;
        path?: string;
    }


    class ProgressBar extends kendo.ui.Widget {
        static fn: ProgressBar;
        static extend(proto: Object): ProgressBar;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ProgressBarOptions);
        options: ProgressBarOptions;
        enable(enable: boolean): void;
        value(): number;
        value(value: number): void;
        progressStatus: JQuery;
        progressWrapper: JQuery;
    }

    interface ProgressBarAnimation {
        duration?: number;
    }

    interface ProgressBarOptions {
        name?: string;
        animation?: ProgressBarAnimation;
        chunkCount?: number;
        enable?: boolean;
        max?: number;
        min?: number;
        orientation?: string;
        reverse?: boolean;
        showStatus?: boolean;
        type?: string;
        value?: number;
        change?(e: ProgressBarChangeEvent): void;
        complete?(e: ProgressBarCompleteEvent): void;
    }

    interface ProgressBarEvent {
        sender: ProgressBar;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ProgressBarChangeEvent extends ProgressBarEvent {
        value?: number;
    }

    interface ProgressBarCompleteEvent extends ProgressBarEvent {
        value?: number;
    }


    class RangeSlider extends kendo.ui.Widget {
        static fn: RangeSlider;
        static extend(proto: Object): RangeSlider;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: RangeSliderOptions);
        options: RangeSliderOptions;
        destroy(): void;
        enable(enable: boolean): void;
        value(): any;
        value(selectionStart: number, selectionEnd: number): void;
    }

    interface RangeSliderTooltip {
        enabled?: boolean;
        format?: string;
        template?: string;
    }

    interface RangeSliderOptions {
        name?: string;
        largeStep?: number;
        max?: number;
        min?: number;
        orientation?: string;
        selectionEnd?: number;
        selectionStart?: number;
        smallStep?: number;
        tickPlacement?: string;
        tooltip?: RangeSliderTooltip;
        change?(e: RangeSliderChangeEvent): void;
        slide?(e: RangeSliderSlideEvent): void;
    }

    interface RangeSliderEvent {
        sender: RangeSlider;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface RangeSliderChangeEvent extends RangeSliderEvent {
        value?: number;
    }

    interface RangeSliderSlideEvent extends RangeSliderEvent {
        value?: number;
    }


    class Scheduler extends kendo.ui.Widget {
        static fn: Scheduler;
        static extend(proto: Object): Scheduler;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: SchedulerOptions);
        options: SchedulerOptions;
        dataSource: kendo.data.DataSource;
        addEvent(data: any): void;
        cancelEvent(): void;
        date(): Date;
        date(value?: Date): void;
        destroy(): void;
        editEvent(event: string): void;
        editEvent(event: kendo.data.SchedulerEvent): void;
        occurrenceByUid(uid: string): kendo.data.SchedulerEvent;
        occurrencesInRange(start: Date, end: Date): any;
        removeEvent(event: string): void;
        removeEvent(event: kendo.data.SchedulerEvent): void;
        resourcesBySlot(slot: any): any;
        saveEvent(): void;
        setDataSource(dataSource: kendo.data.SchedulerDataSource): void;
        slotByPosition(xPosition: number, yPosition: number): any;
        slotByElement(element: Element): any;
        slotByElement(element: JQuery): any;
        view(): kendo.ui.SchedulerView;
        view(type?: string): void;
    }

    interface SchedulerCurrentTimeMarker {
        updateInterval?: number;
        useLocalTimezone?: boolean;
    }

    interface SchedulerEditable {
        confirmation?: any;
        create?: boolean;
        destroy?: boolean;
        move?: boolean;
        resize?: boolean;
        template?: any;
        update?: boolean;
    }

    interface SchedulerFooter {
        command?: any;
    }

    interface SchedulerGroup {
        resources?: any;
        orientation?: string;
    }

    interface SchedulerMessagesEditor {
        allDayEvent?: string;
        description?: string;
        editorTitle?: string;
        end?: string;
        endTimezone?: string;
        repeat?: string;
        separateTimezones?: string;
        start?: string;
        startTimezone?: string;
        timezone?: string;
        timezoneEditorButton?: string;
        timezoneEditorTitle?: string;
        title?: string;
    }

    interface SchedulerMessagesRecurrenceEditorDaily {
        interval?: string;
        repeatEvery?: string;
    }

    interface SchedulerMessagesRecurrenceEditorEnd {
        after?: string;
        occurrence?: string;
        label?: string;
        never?: string;
        mobileLabel?: string;
        on?: string;
    }

    interface SchedulerMessagesRecurrenceEditorFrequencies {
        daily?: string;
        monthly?: string;
        never?: string;
        weekly?: string;
        yearly?: string;
    }

    interface SchedulerMessagesRecurrenceEditorMonthly {
        day?: string;
        interval?: string;
        repeatEvery?: string;
        repeatOn?: string;
    }

    interface SchedulerMessagesRecurrenceEditorOffsetPositions {
        first?: string;
        second?: string;
        third?: string;
        fourth?: string;
        last?: string;
    }

    interface SchedulerMessagesRecurrenceEditorWeekdays {
        day?: string;
        weekday?: string;
        weekend?: string;
    }

    interface SchedulerMessagesRecurrenceEditorWeekly {
        interval?: string;
        repeatEvery?: string;
        repeatOn?: string;
    }

    interface SchedulerMessagesRecurrenceEditorYearly {
        of?: string;
        repeatEvery?: string;
        repeatOn?: string;
        interval?: string;
    }

    interface SchedulerMessagesRecurrenceEditor {
        daily?: SchedulerMessagesRecurrenceEditorDaily;
        end?: SchedulerMessagesRecurrenceEditorEnd;
        frequencies?: SchedulerMessagesRecurrenceEditorFrequencies;
        monthly?: SchedulerMessagesRecurrenceEditorMonthly;
        offsetPositions?: SchedulerMessagesRecurrenceEditorOffsetPositions;
        weekly?: SchedulerMessagesRecurrenceEditorWeekly;
        weekdays?: SchedulerMessagesRecurrenceEditorWeekdays;
        yearly?: SchedulerMessagesRecurrenceEditorYearly;
    }

    interface SchedulerMessagesRecurrenceMessages {
        deleteRecurring?: string;
        deleteWindowOccurrence?: string;
        deleteWindowSeries?: string;
        deleteWindowTitle?: string;
        editRecurring?: string;
        editWindowOccurrence?: string;
        editWindowSeries?: string;
        editWindowTitle?: string;
    }

    interface SchedulerMessagesViews {
        day?: string;
        week?: string;
        month?: string;
        agenda?: string;
    }

    interface SchedulerMessages {
        allDay?: string;
        cancel?: string;
        date?: string;
        deleteWindowTitle?: string;
        destroy?: string;
        event?: string;
        save?: string;
        showFullDay?: string;
        showWorkDay?: string;
        time?: string;
        today?: string;
        editor?: SchedulerMessagesEditor;
        recurrenceEditor?: SchedulerMessagesRecurrenceEditor;
        recurrenceMessages?: SchedulerMessagesRecurrenceMessages;
        views?: SchedulerMessagesViews;
    }

    interface SchedulerResource {
        dataColorField?: string;
        dataSource?: any;
        dataTextField?: string;
        dataValueField?: string;
        field?: string;
        multiple?: boolean;
        name?: string;
        title?: string;
        valuePrimitive?: boolean;
    }

    interface SchedulerViewEditable {
        create?: boolean;
        destroy?: boolean;
        update?: boolean;
    }

    interface SchedulerViewGroup {
        orientation?: string;
    }

    interface SchedulerView {
        allDayEventTemplate?: any;
        allDaySlot?: boolean;
        allDaySlotTemplate?: any;
        dateHeaderTemplate?: any;
        dayTemplate?: any;
        editable?: SchedulerViewEditable;
        endTime?: Date;
        eventHeight?: number;
        eventTemplate?: any;
        eventTimeTemplate?: any;
        group?: SchedulerViewGroup;
        majorTick?: number;
        majorTimeHeaderTemplate?: any;
        minorTickCount?: number;
        minorTimeHeaderTemplate?: any;
        selected?: boolean;
        selectedDateFormat?: string;
        showWorkHours?: boolean;
        slotTemplate?: any;
        startTime?: Date;
        title?: string;
        type?: string;
        workWeekStart?: number;
        workWeekEnd?: number;
    }

    interface SchedulerOptions {
        name?: string;
        allDayEventTemplate?: any;
        allDaySlot?: boolean;
        autoBind?: boolean;
        currentTimeMarker?: SchedulerCurrentTimeMarker;
        dataSource?: any;
        date?: Date;
        dateHeaderTemplate?: any;
        editable?: SchedulerEditable;
        endTime?: Date;
        eventTemplate?: any;
        footer?: SchedulerFooter;
        group?: SchedulerGroup;
        height?: any;
        majorTick?: number;
        majorTimeHeaderTemplate?: any;
        max?: Date;
        messages?: SchedulerMessages;
        min?: Date;
        minorTickCount?: number;
        minorTimeHeaderTemplate?: any;
        mobile?: any;
        resources?: SchedulerResource[];
        selectable?: boolean;
        showWorkHours?: boolean;
        snap?: boolean;
        startTime?: Date;
        timezone?: string;
        views?: SchedulerView[];
        width?: any;
        workDayStart?: Date;
        workDayEnd?: Date;
        workWeekStart?: number;
        workWeekEnd?: number;
        add?(e: SchedulerAddEvent): void;
        cancel?(e: SchedulerCancelEvent): void;
        change?(e: SchedulerChangeEvent): void;
        dataBinding?(e: SchedulerDataBindingEvent): void;
        dataBound?(e: SchedulerDataBoundEvent): void;
        edit?(e: SchedulerEditEvent): void;
        moveStart?(e: SchedulerMoveStartEvent): void;
        move?(e: SchedulerMoveEvent): void;
        moveEnd?(e: SchedulerMoveEndEvent): void;
        navigate?(e: SchedulerNavigateEvent): void;
        remove?(e: SchedulerRemoveEvent): void;
        resizeStart?(e: SchedulerResizeStartEvent): void;
        resize?(e: SchedulerResizeEvent): void;
        resizeEnd?(e: SchedulerResizeEndEvent): void;
        save?(e: SchedulerSaveEvent): void;
    }

    interface SchedulerEvent {
        sender: Scheduler;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface SchedulerAddEvent extends SchedulerEvent {
        event?: any;
    }

    interface SchedulerCancelEvent extends SchedulerEvent {
        container?: JQuery;
        event?: kendo.data.SchedulerEvent;
    }

    interface SchedulerChangeEvent extends SchedulerEvent {
        start?: Date;
        end?: Date;
        events?: any;
        slots?: any;
        resources?: any;
    }

    interface SchedulerDataBindingEvent extends SchedulerEvent {
    }

    interface SchedulerDataBoundEvent extends SchedulerEvent {
    }

    interface SchedulerEditEvent extends SchedulerEvent {
        container?: JQuery;
        event?: kendo.data.SchedulerEvent;
    }

    interface SchedulerMoveStartEvent extends SchedulerEvent {
        event?: kendo.data.SchedulerEvent;
    }

    interface SchedulerMoveEvent extends SchedulerEvent {
        event?: kendo.data.SchedulerEvent;
        slot?: any;
    }

    interface SchedulerMoveEndEvent extends SchedulerEvent {
        start?: Date;
        end?: Date;
        event?: kendo.data.SchedulerEvent;
        slot?: any;
        resources?: any;
    }

    interface SchedulerNavigateEvent extends SchedulerEvent {
        action?: string;
        date?: Date;
        view?: string;
    }

    interface SchedulerRemoveEvent extends SchedulerEvent {
        event?: kendo.data.SchedulerEvent;
    }

    interface SchedulerResizeStartEvent extends SchedulerEvent {
        event?: kendo.data.SchedulerEvent;
    }

    interface SchedulerResizeEvent extends SchedulerEvent {
        event?: kendo.data.SchedulerEvent;
        slot?: any;
    }

    interface SchedulerResizeEndEvent extends SchedulerEvent {
        event?: kendo.data.SchedulerEvent;
        slot?: any;
    }

    interface SchedulerSaveEvent extends SchedulerEvent {
        container?: JQuery;
        event?: kendo.data.SchedulerEvent;
    }


    class Slider extends kendo.ui.Widget {
        static fn: Slider;
        static extend(proto: Object): Slider;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: SliderOptions);
        options: SliderOptions;
        destroy(): void;
        enable(enable: boolean): void;
        value(): number;
        value(value: number): void;
    }

    interface SliderTooltip {
        enabled?: boolean;
        format?: string;
        template?: string;
    }

    interface SliderOptions {
        name?: string;
        decreaseButtonTitle?: string;
        increaseButtonTitle?: string;
        largeStep?: number;
        max?: number;
        min?: number;
        orientation?: string;
        showButtons?: boolean;
        smallStep?: number;
        tickPlacement?: string;
        tooltip?: SliderTooltip;
        value?: number;
        change?(e: SliderChangeEvent): void;
        slide?(e: SliderSlideEvent): void;
    }

    interface SliderEvent {
        sender: Slider;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface SliderChangeEvent extends SliderEvent {
        value?: number;
    }

    interface SliderSlideEvent extends SliderEvent {
        value?: number;
    }


    class Sortable extends kendo.ui.Widget {
        static fn: Sortable;
        static extend(proto: Object): Sortable;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: SortableOptions);
        options: SortableOptions;
        indexOf(element: JQuery): number;
        items(): JQuery;
    }

    interface SortableCursorOffset {
        left?: number;
        top?: number;
    }

    interface SortableOptions {
        name?: string;
        axis?: string;
        container?: string;
        connectWith?: string;
        cursor?: string;
        cursorOffset?: SortableCursorOffset;
        disabled?: string;
        filter?: string;
        handler?: string;
        hint?: any;
        holdToDrag?: boolean;
        ignore?: string;
        placeholder?: any;
        start?(e: SortableStartEvent): void;
        move?(e: SortableMoveEvent): void;
        end?(e: SortableEndEvent): void;
        change?(e: SortableChangeEvent): void;
        cancel?(e: SortableCancelEvent): void;
    }

    interface SortableEvent {
        sender: Sortable;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface SortableStartEvent extends SortableEvent {
        draggableEvent?: any;
        item?: JQuery;
    }

    interface SortableMoveEvent extends SortableEvent {
        item?: JQuery;
        target?: JQuery;
        list?: kendo.ui.Sortable;
        draggableEvent?: any;
    }

    interface SortableEndEvent extends SortableEvent {
        action?: string;
        item?: JQuery;
        oldIndex?: number;
        newIndex?: number;
        draggableEvent?: any;
    }

    interface SortableChangeEvent extends SortableEvent {
        action?: string;
        item?: JQuery;
        oldIndex?: number;
        newIndex?: number;
        draggableEvent?: any;
    }

    interface SortableCancelEvent extends SortableEvent {
        item?: JQuery;
    }


    class Splitter extends kendo.ui.Widget {
        static fn: Splitter;
        static extend(proto: Object): Splitter;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: SplitterOptions);
        options: SplitterOptions;
        ajaxRequest(pane: string, url: string, data: any): void;
        ajaxRequest(pane: string, url: string, data: string): void;
        ajaxRequest(pane: Element, url: string, data: any): void;
        ajaxRequest(pane: Element, url: string, data: string): void;
        ajaxRequest(pane: JQuery, url: string, data: any): void;
        ajaxRequest(pane: JQuery, url: string, data: string): void;
        append(config?: any): void;
        collapse(pane: string): void;
        collapse(pane: Element): void;
        collapse(pane: JQuery): void;
        destroy(): void;
        expand(pane: string): void;
        expand(pane: Element): void;
        expand(pane: JQuery): void;
        insertAfter(config: any, referencePane: string): JQuery;
        insertAfter(config: any, referencePane: Element): JQuery;
        insertAfter(config: any, referencePane: JQuery): JQuery;
        insertBefore(config: any, referencePane: string): JQuery;
        insertBefore(config: any, referencePane: Element): JQuery;
        insertBefore(config: any, referencePane: JQuery): JQuery;
        max(pane: string, value: string): void;
        max(pane: Element, value: string): void;
        max(pane: JQuery, value: string): void;
        min(pane: string, value: string): void;
        min(pane: Element, value: string): void;
        min(pane: JQuery, value: string): void;
        remove(pane: string): void;
        remove(pane: Element): void;
        remove(pane: JQuery): void;
        size(pane: string, value: string): void;
        size(pane: Element, value: string): void;
        size(pane: JQuery, value: string): void;
        toggle(pane: string, expand?: boolean): void;
        toggle(pane: Element, expand?: boolean): void;
        toggle(pane: JQuery, expand?: boolean): void;
    }

    interface SplitterPane {
        collapsed?: boolean;
        collapsible?: boolean;
        contentUrl?: string;
        max?: string;
        min?: string;
        resizable?: boolean;
        scrollable?: boolean;
        size?: string;
    }

    interface SplitterOptions {
        name?: string;
        orientation?: string;
        panes?: SplitterPane[];
        collapse?(e: SplitterCollapseEvent): void;
        contentLoad?(e: SplitterContentLoadEvent): void;
        error?(e: SplitterErrorEvent): void;
        expand?(e: SplitterExpandEvent): void;
        layoutChange?(e: SplitterEvent): void;
        resize?(e: SplitterEvent): void;
    }

    interface SplitterEvent {
        sender: Splitter;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface SplitterCollapseEvent extends SplitterEvent {
        pane?: Element;
    }

    interface SplitterContentLoadEvent extends SplitterEvent {
        pane?: Element;
    }

    interface SplitterErrorEvent extends SplitterEvent {
        xhr?: JQueryXHR;
        status?: string;
    }

    interface SplitterExpandEvent extends SplitterEvent {
        pane?: Element;
    }


    class TabStrip extends kendo.ui.Widget {
        static fn: TabStrip;
        static extend(proto: Object): TabStrip;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: TabStripOptions);
        options: TabStripOptions;
        activateTab(item: JQuery): void;
        append(tab: any): kendo.ui.TabStrip;
        contentElement(itemIndex: number): Element;
        contentHolder(itemIndex: number): Element;
        deactivateTab(item: JQuery): void;
        destroy(): void;
        disable(element: string): kendo.ui.TabStrip;
        disable(element: Element): kendo.ui.TabStrip;
        disable(element: JQuery): kendo.ui.TabStrip;
        enable(element: string, enable?: boolean): kendo.ui.TabStrip;
        enable(element: Element, enable?: boolean): kendo.ui.TabStrip;
        enable(element: JQuery, enable?: boolean): kendo.ui.TabStrip;
        insertAfter(item: string, referenceTab: string): kendo.ui.TabStrip;
        insertAfter(item: string, referenceTab: Element): kendo.ui.TabStrip;
        insertAfter(item: string, referenceTab: JQuery): kendo.ui.TabStrip;
        insertAfter(item: Element, referenceTab: string): kendo.ui.TabStrip;
        insertAfter(item: Element, referenceTab: Element): kendo.ui.TabStrip;
        insertAfter(item: Element, referenceTab: JQuery): kendo.ui.TabStrip;
        insertAfter(item: JQuery, referenceTab: string): kendo.ui.TabStrip;
        insertAfter(item: JQuery, referenceTab: Element): kendo.ui.TabStrip;
        insertAfter(item: JQuery, referenceTab: JQuery): kendo.ui.TabStrip;
        insertBefore(item: string, referenceTab: string): kendo.ui.TabStrip;
        insertBefore(item: string, referenceTab: Element): kendo.ui.TabStrip;
        insertBefore(item: string, referenceTab: JQuery): kendo.ui.TabStrip;
        insertBefore(item: Element, referenceTab: string): kendo.ui.TabStrip;
        insertBefore(item: Element, referenceTab: Element): kendo.ui.TabStrip;
        insertBefore(item: Element, referenceTab: JQuery): kendo.ui.TabStrip;
        insertBefore(item: JQuery, referenceTab: string): kendo.ui.TabStrip;
        insertBefore(item: JQuery, referenceTab: Element): kendo.ui.TabStrip;
        insertBefore(item: JQuery, referenceTab: JQuery): kendo.ui.TabStrip;
        items(): HTMLCollection;
        reload(element: string): kendo.ui.TabStrip;
        reload(element: Element): kendo.ui.TabStrip;
        reload(element: JQuery): kendo.ui.TabStrip;
        remove(element: string): kendo.ui.TabStrip;
        remove(element: number): kendo.ui.TabStrip;
        select(): JQuery;
        select(element: string): void;
        select(element: Element): void;
        select(element: JQuery): void;
        select(element: number): void;
        tabGroup: JQuery;
    }

    interface TabStripAnimationClose {
        duration?: number;
        effects?: string;
    }

    interface TabStripAnimationOpen {
        duration?: number;
        effects?: string;
    }

    interface TabStripAnimation {
        close?: TabStripAnimationClose;
        open?: TabStripAnimationOpen;
    }

    interface TabStripOptions {
        name?: string;
        animation?: TabStripAnimation;
        collapsible?: boolean;
        contentUrls?: any;
        dataContentField?: string;
        dataContentUrlField?: string;
        dataImageUrlField?: string;
        dataSpriteCssClass?: string;
        dataTextField?: string;
        dataUrlField?: string;
        navigatable?: boolean;
        activate?(e: TabStripActivateEvent): void;
        contentLoad?(e: TabStripContentLoadEvent): void;
        error?(e: TabStripErrorEvent): void;
        select?(e: TabStripSelectEvent): void;
        show?(e: TabStripShowEvent): void;
    }

    interface TabStripEvent {
        sender: TabStrip;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface TabStripActivateEvent extends TabStripEvent {
        item?: Element;
        contentElement?: Element;
    }

    interface TabStripContentLoadEvent extends TabStripEvent {
        item?: Element;
        contentElement?: Element;
    }

    interface TabStripErrorEvent extends TabStripEvent {
        xhr?: JQueryXHR;
        status?: string;
    }

    interface TabStripSelectEvent extends TabStripEvent {
        item?: Element;
        contentElement?: Element;
    }

    interface TabStripShowEvent extends TabStripEvent {
        item?: Element;
        contentElement?: Element;
    }


    class TimePicker extends kendo.ui.Widget {
        static fn: TimePicker;
        static extend(proto: Object): TimePicker;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: TimePickerOptions);
        options: TimePickerOptions;
        close(): void;
        destroy(): void;
        enable(enable: boolean): void;
        readonly(readonly: boolean): void;
        max(): Date;
        max(value: Date): void;
        max(value: string): void;
        min(): Date;
        min(value: Date): void;
        min(value: string): void;
        open(): void;
        setOptions(options: any): void;
        value(): Date;
        value(value: Date): void;
        value(value: string): void;
    }

    interface TimePickerAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface TimePickerAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface TimePickerAnimation {
        close?: TimePickerAnimationClose;
        open?: TimePickerAnimationOpen;
    }

    interface TimePickerOptions {
        name?: string;
        animation?: TimePickerAnimation;
        culture?: string;
        dates?: any;
        format?: string;
        interval?: number;
        max?: Date;
        min?: Date;
        parseFormats?: any;
        value?: Date;
        change?(e: TimePickerChangeEvent): void;
        close?(e: TimePickerCloseEvent): void;
        open?(e: TimePickerOpenEvent): void;
    }

    interface TimePickerEvent {
        sender: TimePicker;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface TimePickerChangeEvent extends TimePickerEvent {
    }

    interface TimePickerCloseEvent extends TimePickerEvent {
    }

    interface TimePickerOpenEvent extends TimePickerEvent {
    }


    class ToolBar extends kendo.ui.Widget {
        static fn: ToolBar;
        static extend(proto: Object): ToolBar;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ToolBarOptions);
        options: ToolBarOptions;
        add(command: any): void;
        destroy(): void;
        enable(command: string, enable: boolean): void;
        enable(command: Element, enable: boolean): void;
        enable(command: JQuery, enable: boolean): void;
        getSelectedFromGroup(groupName: string): void;
        remove(command: string): void;
        remove(command: Element): void;
        remove(command: JQuery): void;
    }

    interface ToolBarItemButton {
        click?: Function;
        enable?: boolean;
        group?: string;
        icon?: string;
        id?: string;
        imageUrl?: string;
        selected?: boolean;
        showIcon?: string;
        showText?: string;
        spriteCssClass?: string;
        toggle?: Function;
        togglable?: boolean;
        text?: string;
        url?: string;
    }

    interface ToolBarItemMenuButton {
        enable?: boolean;
        icon?: string;
        id?: string;
        imageUrl?: string;
        spriteCssClass?: string;
        text?: string;
        url?: string;
    }

    interface ToolBarItem {
        buttons?: ToolBarItemButton[];
        click?: Function;
        enable?: boolean;
        group?: string;
        icon?: string;
        id?: string;
        imageUrl?: string;
        menuButtons?: ToolBarItemMenuButton[];
        overflow?: string;
        overflowTemplate?: any;
        primary?: boolean;
        selected?: boolean;
        showIcon?: string;
        showText?: string;
        spriteCssClass?: string;
        template?: any;
        text?: string;
        togglable?: boolean;
        toggle?: Function;
        type?: string;
        url?: string;
    }

    interface ToolBarOptions {
        name?: string;
        resizable?: boolean;
        items?: ToolBarItem[];
        click?(e: ToolBarClickEvent): void;
        close?(e: ToolBarCloseEvent): void;
        open?(e: ToolBarOpenEvent): void;
        toggle?(e: ToolBarToggleEvent): void;
        overflowClose?(e: ToolBarOverflowCloseEvent): void;
        overflowOpen?(e: ToolBarOverflowOpenEvent): void;
    }

    interface ToolBarEvent {
        sender: ToolBar;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ToolBarClickEvent extends ToolBarEvent {
        target?: JQuery;
        id?: string;
    }

    interface ToolBarCloseEvent extends ToolBarEvent {
        SplitButton?: JQuery;
    }

    interface ToolBarOpenEvent extends ToolBarEvent {
        SplitButton?: JQuery;
    }

    interface ToolBarToggleEvent extends ToolBarEvent {
        target?: JQuery;
        checked?: boolean;
        id?: string;
    }

    interface ToolBarOverflowCloseEvent extends ToolBarEvent {
    }

    interface ToolBarOverflowOpenEvent extends ToolBarEvent {
    }


    class Tooltip extends kendo.ui.Widget {
        static fn: Tooltip;
        static extend(proto: Object): Tooltip;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: TooltipOptions);
        options: TooltipOptions;
        show(element: JQuery): void;
        hide(): void;
        refresh(): void;
        target(): JQuery;
    }

    interface TooltipAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface TooltipAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface TooltipAnimation {
        close?: TooltipAnimationClose;
        open?: TooltipAnimationOpen;
    }

    interface TooltipContent {
        url?: string;
    }

    interface TooltipOptions {
        name?: string;
        autoHide?: boolean;
        animation?: TooltipAnimation;
        content?: TooltipContent;
        callout?: boolean;
        filter?: string;
        iframe?: boolean;
        height?: number;
        width?: number;
        position?: string;
        showAfter?: number;
        showOn?: string;
        contentLoad?(e: TooltipEvent): void;
        show?(e: TooltipEvent): void;
        hide?(e: TooltipEvent): void;
        requestStart?(e: TooltipRequestStartEvent): void;
        error?(e: TooltipErrorEvent): void;
    }

    interface TooltipEvent {
        sender: Tooltip;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface TooltipRequestStartEvent extends TooltipEvent {
        target?: JQuery;
        options?: any;
    }

    interface TooltipErrorEvent extends TooltipEvent {
        xhr?: JQueryXHR;
        status?: string;
    }


    class Touch extends kendo.ui.Widget {
        static fn: Touch;
        static extend(proto: Object): Touch;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: TouchOptions);
        options: TouchOptions;
        cancel(): void;
        destroy(): void;
    }

    interface TouchOptions {
        name?: string;
        filter?: string;
        surface?: JQuery;
        multiTouch?: boolean;
        enableSwipe?: boolean;
        minXDelta?: number;
        maxYDelta?: number;
        maxDuration?: number;
        minHold?: number;
        doubleTapTimeout?: number;
        touchstart?(e: TouchTouchstartEvent): void;
        dragstart?(e: TouchDragstartEvent): void;
        drag?(e: TouchDragEvent): void;
        dragend?(e: TouchDragendEvent): void;
        tap?(e: TouchTapEvent): void;
        doubletap?(e: TouchDoubletapEvent): void;
        hold?(e: TouchHoldEvent): void;
        swipe?(e: TouchSwipeEvent): void;
        gesturestart?(e: TouchGesturestartEvent): void;
        gesturechange?(e: TouchGesturechangeEvent): void;
        gestureend?(e: TouchGestureendEvent): void;
    }

    interface TouchEvent {
        sender: Touch;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface TouchTouchstartEvent extends TouchEvent {
        touch?: kendo.mobile.ui.TouchEventOptions;
        event?: JQueryEventObject;
    }

    interface TouchDragstartEvent extends TouchEvent {
        touch?: kendo.mobile.ui.TouchEventOptions;
        event?: JQueryEventObject;
    }

    interface TouchDragEvent extends TouchEvent {
        touch?: kendo.mobile.ui.TouchEventOptions;
        event?: JQueryEventObject;
    }

    interface TouchDragendEvent extends TouchEvent {
        touch?: kendo.mobile.ui.TouchEventOptions;
        event?: JQueryEventObject;
    }

    interface TouchTapEvent extends TouchEvent {
        touch?: kendo.mobile.ui.TouchEventOptions;
        event?: JQueryEventObject;
    }

    interface TouchDoubletapEvent extends TouchEvent {
        touch?: kendo.mobile.ui.TouchEventOptions;
        event?: JQueryEventObject;
    }

    interface TouchHoldEvent extends TouchEvent {
        touch?: kendo.mobile.ui.TouchEventOptions;
        event?: JQueryEventObject;
    }

    interface TouchSwipeEvent extends TouchEvent {
        touch?: kendo.mobile.ui.TouchEventOptions;
        event?: JQueryEventObject;
    }

    interface TouchGesturestartEvent extends TouchEvent {
        touches?: any;
        event?: JQueryEventObject;
        distance?: number;
        center?: kendo.mobile.ui.Point;
    }

    interface TouchGesturechangeEvent extends TouchEvent {
        touches?: any;
        event?: JQueryEventObject;
        distance?: number;
        center?: kendo.mobile.ui.Point;
    }

    interface TouchGestureendEvent extends TouchEvent {
        touches?: any;
        event?: JQueryEventObject;
        distance?: number;
        center?: kendo.mobile.ui.Point;
    }


    class TreeView extends kendo.ui.Widget {
        static fn: TreeView;
        static extend(proto: Object): TreeView;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: TreeViewOptions);
        options: TreeViewOptions;
        dataSource: kendo.data.DataSource;
        append(nodeData: any, parentNode?: JQuery, success?: Function): JQuery;
        append(nodeData: JQuery, parentNode?: JQuery, success?: Function): JQuery;
        collapse(nodes: JQuery): void;
        collapse(nodes: Element): void;
        collapse(nodes: string): void;
        dataItem(node: JQuery): kendo.data.Node;
        dataItem(node: Element): kendo.data.Node;
        dataItem(node: string): kendo.data.Node;
        destroy(): void;
        detach(node: JQuery): JQuery;
        detach(node: Element): JQuery;
        detach(node: string): JQuery;
        enable(nodes: JQuery, enable?: boolean): void;
        enable(nodes: Element, enable?: boolean): void;
        enable(nodes: string, enable?: boolean): void;
        expand(nodes: JQuery): void;
        expand(nodes: Element): void;
        expand(nodes: string): void;
        expandPath(path: any, complete: Function): void;
        expandTo(targetNode: kendo.data.Node): void;
        expandTo(targetNode: any): void;
        findByText(text: string): JQuery;
        findByUid(text: string): JQuery;
        insertAfter(nodeData: any, referenceNode: JQuery): void;
        insertBefore(nodeData: any, referenceNode: JQuery): void;
        parent(node: JQuery): JQuery;
        parent(node: Element): JQuery;
        parent(node: string): JQuery;
        remove(node: JQuery): void;
        remove(node: Element): void;
        remove(node: string): void;
        select(): JQuery;
        select(node?: JQuery): void;
        select(node?: Element): void;
        select(node?: string): void;
        setDataSource(dataSource: kendo.data.HierarchicalDataSource): void;
        text(): string;
        text(node: JQuery, newText: string): void;
        text(node: Element, newText: string): void;
        text(node: string, newText: string): void;
        toggle(node: JQuery): void;
        toggle(node: Element): void;
        toggle(node: string): void;
        updateIndeterminate(node: JQuery): void;
    }

    interface TreeViewAnimationCollapse {
        duration?: number;
        effects?: string;
    }

    interface TreeViewAnimationExpand {
        duration?: number;
        effects?: string;
    }

    interface TreeViewAnimation {
        collapse?: TreeViewAnimationCollapse;
        expand?: TreeViewAnimationExpand;
    }

    interface TreeViewCheckboxes {
        name?: string;
        checkChildren?: boolean;
        template?: any;
    }

    interface TreeViewMessages {
        loading?: string;
        retry?: string;
        requestFailed?: string;
    }

    interface TreeViewOptions {
        name?: string;
        animation?: TreeViewAnimation;
        autoBind?: boolean;
        checkboxes?: TreeViewCheckboxes;
        dataImageUrlField?: string;
        dataSource?: any;
        dataSpriteCssClassField?: string;
        dataTextField?: any;
        dataUrlField?: string;
        dragAndDrop?: boolean;
        loadOnDemand?: boolean;
        messages?: TreeViewMessages;
        template?: any;
        collapse?(e: TreeViewCollapseEvent): void;
        dataBound?(e: TreeViewDataBoundEvent): void;
        drag?(e: TreeViewDragEvent): void;
        dragend?(e: TreeViewDragendEvent): void;
        dragstart?(e: TreeViewDragstartEvent): void;
        drop?(e: TreeViewDropEvent): void;
        expand?(e: TreeViewExpandEvent): void;
        change?(e: TreeViewEvent): void;
        select?(e: TreeViewSelectEvent): void;
        navigate?(e: TreeViewNavigateEvent): void;
    }

    interface TreeViewEvent {
        sender: TreeView;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface TreeViewCollapseEvent extends TreeViewEvent {
        node?: Element;
    }

    interface TreeViewDataBoundEvent extends TreeViewEvent {
        node?: JQuery;
    }

    interface TreeViewDragEvent extends TreeViewEvent {
        sourceNode?: Element;
        dropTarget?: Element;
        pageX?: number;
        pageY?: number;
        statusClass?: string;
        setStatusClass?: Function;
    }

    interface TreeViewDragendEvent extends TreeViewEvent {
        sourceNode?: Element;
        destinationNode?: Element;
        dropPosition?: string;
    }

    interface TreeViewDragstartEvent extends TreeViewEvent {
        sourceNode?: Element;
    }

    interface TreeViewDropEvent extends TreeViewEvent {
        sourceNode?: Element;
        destinationNode?: Element;
        valid?: boolean;
        setValid?: Function;
        dropTarget?: Element;
        dropPosition?: string;
    }

    interface TreeViewExpandEvent extends TreeViewEvent {
        node?: Element;
    }

    interface TreeViewSelectEvent extends TreeViewEvent {
        node?: Element;
    }

    interface TreeViewNavigateEvent extends TreeViewEvent {
        node?: Element;
    }


    class Upload extends kendo.ui.Widget {
        static fn: Upload;
        static extend(proto: Object): Upload;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: UploadOptions);
        options: UploadOptions;
        destroy(): void;
        disable(): void;
        enable(enable?: boolean): void;
        toggle(enable: boolean): void;
    }

    interface UploadAsync {
        autoUpload?: boolean;
        batch?: boolean;
        removeField?: string;
        removeUrl?: string;
        removeVerb?: string;
        saveField?: string;
        saveUrl?: string;
        withCredentials?: boolean;
    }

    interface UploadLocalization {
        cancel?: string;
        dropFilesHere?: string;
        headerStatusUploaded?: string;
        headerStatusUploading?: string;
        remove?: string;
        retry?: string;
        select?: string;
        statusFailed?: string;
        statusUploaded?: string;
        statusUploading?: string;
        uploadSelectedFiles?: string;
    }

    interface UploadOptions {
        name?: string;
        async?: UploadAsync;
        enabled?: boolean;
        files?: any;
        localization?: UploadLocalization;
        multiple?: boolean;
        showFileList?: boolean;
        template?: any;
        cancel?(e: UploadCancelEvent): void;
        complete?(e: UploadEvent): void;
        error?(e: UploadErrorEvent): void;
        progress?(e: UploadProgressEvent): void;
        remove?(e: UploadRemoveEvent): void;
        select?(e: UploadSelectEvent): void;
        success?(e: UploadSuccessEvent): void;
        upload?(e: UploadUploadEvent): void;
    }

    interface UploadEvent {
        sender: Upload;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface UploadCancelEvent extends UploadEvent {
        files?: any;
    }

    interface UploadErrorEvent extends UploadEvent {
        files?: any;
        operation?: string;
        XMLHttpRequest?: any;
    }

    interface UploadProgressEvent extends UploadEvent {
        files?: any;
        percentComplete?: number;
    }

    interface UploadRemoveEvent extends UploadEvent {
        files?: any;
        data?: any;
    }

    interface UploadSelectEvent extends UploadEvent {
        e?: any;
        files?: any;
    }

    interface UploadSuccessEvent extends UploadEvent {
        files?: any;
        operation?: string;
        response?: string;
        XMLHttpRequest?: any;
    }

    interface UploadUploadEvent extends UploadEvent {
        files?: any;
        data?: any;
        XMLHttpRequest?: any;
    }


    class Validator extends kendo.ui.Widget {
        static fn: Validator;
        static extend(proto: Object): Validator;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ValidatorOptions);
        options: ValidatorOptions;
        errors(): any;
        hideMessages(): void;
        validate(): boolean;
        validateInput(input: Element): boolean;
        validateInput(input: JQuery): boolean;
    }

    interface ValidatorOptions {
        name?: string;
        errorTemplate?: string;
        messages?: any;
        rules?: any;
        validateOnBlur?: boolean;
        validate?(e: ValidatorValidateEvent): void;
    }

    interface ValidatorEvent {
        sender: Validator;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ValidatorValidateEvent extends ValidatorEvent {
    }


    class Window extends kendo.ui.Widget {
        static fn: Window;
        static extend(proto: Object): Window;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: WindowOptions);
        options: WindowOptions;
        center(): kendo.ui.Window;
        close(): kendo.ui.Window;
        content(): kendo.ui.Window;
        content(content?: string): void;
        destroy(): void;
        maximize(): kendo.ui.Window;
        minimize(): kendo.ui.Window;
        open(): kendo.ui.Window;
        pin(): void;
        refresh(options: any): kendo.ui.Window;
        restore(): kendo.ui.Window;
        setOptions(options: any): void;
        title(): kendo.ui.Window;
        title(text?: string): void;
        toFront(): kendo.ui.Window;
        toggleMaximization(): kendo.ui.Window;
        unpin(): void;
    }

    interface WindowAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface WindowAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface WindowAnimation {
        close?: WindowAnimationClose;
        open?: WindowAnimationOpen;
    }

    interface WindowContent {
        template?: string;
    }

    interface WindowPosition {
        top?: number;
        left?: number;
    }

    interface WindowRefreshOptions {
        url?: string;
        data?: any;
        type?: string;
        template?: string;
        iframe?: boolean;
    }

    interface WindowOptions {
        name?: string;
        actions?: any;
        animation?: WindowAnimation;
        appendTo?: any;
        content?: WindowContent;
        draggable?: boolean;
        iframe?: boolean;
        maxHeight?: number;
        maxWidth?: number;
        minHeight?: number;
        minWidth?: number;
        modal?: boolean;
        pinned?: boolean;
        position?: WindowPosition;
        resizable?: boolean;
        title?: any;
        visible?: boolean;
        width?: any;
        height?: any;
        activate?(e: WindowEvent): void;
        close?(e: WindowCloseEvent): void;
        deactivate?(e: WindowEvent): void;
        dragend?(e: WindowEvent): void;
        dragstart?(e: WindowEvent): void;
        error?(e: WindowErrorEvent): void;
        open?(e: WindowEvent): void;
        refresh?(e: WindowEvent): void;
        resize?(e: WindowEvent): void;
    }

    interface WindowEvent {
        sender: Window;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface WindowCloseEvent extends WindowEvent {
        userTriggered?: boolean;
    }

    interface WindowErrorEvent extends WindowEvent {
        xhr?: JQueryXHR;
        status?: string;
    }


}
declare module kendo.dataviz.ui {
    class Barcode extends kendo.ui.Widget {
        static fn: Barcode;
        static extend(proto: Object): Barcode;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: BarcodeOptions);
        options: BarcodeOptions;
        imageDataURL(): string;
        redraw(): void;
        resize(force?: boolean): void;
        svg(): string;
        value(): string;
        value(value: number): void;
        value(value: string): void;
    }

    interface BarcodeBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface BarcodePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface BarcodeTextMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface BarcodeText {
        color?: string;
        font?: string;
        margin?: BarcodeTextMargin;
        visible?: boolean;
    }

    interface BarcodeOptions {
        name?: string;
        renderAs?: string;
        background?: string;
        border?: BarcodeBorder;
        checksum?: boolean;
        color?: string;
        height?: number;
        padding?: BarcodePadding;
        text?: BarcodeText;
        type?: string;
        value?: string;
        width?: number;
    }

    interface BarcodeEvent {
        sender: Barcode;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Chart extends kendo.ui.Widget {
        static fn: Chart;
        static extend(proto: Object): Chart;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ChartOptions);
        options: ChartOptions;
        dataSource: kendo.data.DataSource;
        destroy(): void;
        redraw(): void;
        refresh(): void;
        resize(force?: boolean): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        setOptions(options: any): void;
        svg(): string;
        imageDataURL(): string;
    }

    interface ChartCategoryAxisItemAutoBaseUnitSteps {
        seconds?: any;
        minutes?: any;
        hours?: any;
        days?: any;
        weeks?: any;
        months?: any;
        years?: any;
    }

    interface ChartCategoryAxisItemCrosshairTooltipBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemCrosshairTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartCategoryAxisItemCrosshairTooltip {
        background?: string;
        border?: ChartCategoryAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartCategoryAxisItemCrosshairTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartCategoryAxisItemCrosshair {
        color?: string;
        opacity?: number;
        tooltip?: ChartCategoryAxisItemCrosshairTooltip;
        visible?: boolean;
        width?: number;
    }

    interface ChartCategoryAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemLabelsDateFormats {
        days?: string;
        hours?: string;
        months?: string;
        weeks?: string;
        years?: string;
    }

    interface ChartCategoryAxisItemLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartCategoryAxisItemLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartCategoryAxisItemLabels {
        background?: string;
        border?: ChartCategoryAxisItemLabelsBorder;
        color?: string;
        culture?: string;
        dateFormats?: ChartCategoryAxisItemLabelsDateFormats;
        font?: string;
        format?: string;
        margin?: ChartCategoryAxisItemLabelsMargin;
        mirror?: boolean;
        padding?: ChartCategoryAxisItemLabelsPadding;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface ChartCategoryAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface ChartCategoryAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartCategoryAxisItemMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartCategoryAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartCategoryAxisItemMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartCategoryAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemNotesDataItemIcon {
        background?: string;
        border?: ChartCategoryAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartCategoryAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemNotesDataItemLabel {
        background?: string;
        border?: ChartCategoryAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface ChartCategoryAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartCategoryAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: ChartCategoryAxisItemNotesDataItemIcon;
        label?: ChartCategoryAxisItemNotesDataItemLabel;
        line?: ChartCategoryAxisItemNotesDataItemLine;
    }

    interface ChartCategoryAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemNotesIcon {
        background?: string;
        border?: ChartCategoryAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartCategoryAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemNotesLabel {
        background?: string;
        border?: ChartCategoryAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface ChartCategoryAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartCategoryAxisItemNotes {
        position?: string;
        icon?: ChartCategoryAxisItemNotesIcon;
        label?: ChartCategoryAxisItemNotesLabel;
        line?: ChartCategoryAxisItemNotesLine;
        data?: ChartCategoryAxisItemNotesDataItem[];
    }

    interface ChartCategoryAxisItemPlotBand {
        color?: string;
        from?: number;
        opacity?: number;
        to?: number;
    }

    interface ChartCategoryAxisItemSelectMousewheel {
        reverse?: boolean;
        zoom?: string;
    }

    interface ChartCategoryAxisItemSelect {
        from?: any;
        max?: any;
        min?: any;
        mousewheel?: ChartCategoryAxisItemSelectMousewheel;
        to?: any;
    }

    interface ChartCategoryAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartCategoryAxisItemTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartCategoryAxisItemTitlePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartCategoryAxisItemTitle {
        background?: string;
        border?: ChartCategoryAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: ChartCategoryAxisItemTitleMargin;
        padding?: ChartCategoryAxisItemTitlePadding;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface ChartCategoryAxisItem {
        autoBaseUnitSteps?: ChartCategoryAxisItemAutoBaseUnitSteps;
        axisCrossingValue?: any;
        background?: string;
        baseUnit?: string;
        baseUnitStep?: any;
        categories?: any;
        color?: string;
        crosshair?: ChartCategoryAxisItemCrosshair;
        field?: string;
        justified?: boolean;
        labels?: ChartCategoryAxisItemLabels;
        line?: ChartCategoryAxisItemLine;
        majorGridLines?: ChartCategoryAxisItemMajorGridLines;
        majorTicks?: ChartCategoryAxisItemMajorTicks;
        max?: any;
        maxDateGroups?: number;
        min?: any;
        minorGridLines?: ChartCategoryAxisItemMinorGridLines;
        minorTicks?: ChartCategoryAxisItemMinorTicks;
        name?: string;
        pane?: string;
        plotBands?: ChartCategoryAxisItemPlotBand[];
        reverse?: boolean;
        roundToBaseUnit?: boolean;
        select?: ChartCategoryAxisItemSelect;
        startAngle?: number;
        title?: ChartCategoryAxisItemTitle;
        type?: string;
        visible?: boolean;
        weekStartDay?: number;
        notes?: ChartCategoryAxisItemNotes;
    }

    interface ChartChartAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartChartAreaMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartChartArea {
        background?: string;
        border?: ChartChartAreaBorder;
        height?: number;
        margin?: ChartChartAreaMargin;
        opacity?: number;
        width?: number;
    }

    interface ChartLegendBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartLegendInactiveItemsLabels {
        color?: string;
        font?: string;
        template?: any;
    }

    interface ChartLegendInactiveItems {
        labels?: ChartLegendInactiveItemsLabels;
    }

    interface ChartLegendLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartLegendLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartLegendLabels {
        color?: string;
        font?: string;
        margin?: ChartLegendLabelsMargin;
        padding?: ChartLegendLabelsPadding;
        template?: any;
    }

    interface ChartLegendMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartLegendPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartLegend {
        background?: string;
        border?: ChartLegendBorder;
        height?: number;
        inactiveItems?: ChartLegendInactiveItems;
        labels?: ChartLegendLabels;
        margin?: ChartLegendMargin;
        offsetX?: number;
        offsetY?: number;
        orientation?: string;
        padding?: ChartLegendPadding;
        position?: string;
        visible?: boolean;
        width?: number;
    }

    interface ChartPaneBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartPaneMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartPanePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartPaneTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartPaneTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartPaneTitle {
        background?: string;
        border?: ChartPaneTitleBorder;
        color?: string;
        font?: string;
        margin?: ChartPaneTitleMargin;
        position?: string;
        text?: string;
        visible?: boolean;
    }

    interface ChartPane {
        background?: string;
        border?: ChartPaneBorder;
        clip?: boolean;
        height?: number;
        margin?: ChartPaneMargin;
        name?: string;
        padding?: ChartPanePadding;
        title?: ChartPaneTitle;
    }

    interface ChartPlotAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartPlotAreaMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartPlotAreaPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartPlotArea {
        background?: string;
        border?: ChartPlotAreaBorder;
        margin?: ChartPlotAreaMargin;
        opacity?: number;
        padding?: ChartPlotAreaPadding;
    }

    interface ChartSeriesItemBorder {
        color?: any;
        dashType?: any;
        opacity?: any;
        width?: any;
    }

    interface ChartSeriesItemConnectors {
        color?: string;
        padding?: number;
        width?: number;
    }

    interface ChartSeriesItemErrorBarsLine {
        width?: number;
        dashType?: string;
    }

    interface ChartSeriesItemErrorBars {
        value?: any;
        xValue?: any;
        yValue?: any;
        endCaps?: boolean;
        color?: string;
        line?: ChartSeriesItemErrorBarsLine;
    }

    interface ChartSeriesItemExtremesBorder {
        color?: any;
        width?: any;
    }

    interface ChartSeriesItemExtremes {
        background?: any;
        border?: ChartSeriesItemExtremesBorder;
        size?: any;
        type?: any;
        rotation?: any;
    }

    interface ChartSeriesItemHighlightBorder {
        color?: string;
        opacity?: number;
        width?: number;
    }

    interface ChartSeriesItemHighlightLine {
        color?: string;
        opacity?: number;
        width?: number;
    }

    interface ChartSeriesItemHighlight {
        border?: ChartSeriesItemHighlightBorder;
        color?: string;
        line?: ChartSeriesItemHighlightLine;
        opacity?: number;
        visible?: boolean;
    }

    interface ChartSeriesItemLabelsBorder {
        color?: any;
        dashType?: any;
        width?: any;
    }

    interface ChartSeriesItemLabelsFromBorder {
        color?: any;
        dashType?: any;
        width?: any;
    }

    interface ChartSeriesItemLabelsFromMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesItemLabelsFromPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesItemLabelsFrom {
        background?: any;
        border?: ChartSeriesItemLabelsFromBorder;
        color?: any;
        font?: any;
        format?: any;
        margin?: ChartSeriesItemLabelsFromMargin;
        padding?: ChartSeriesItemLabelsFromPadding;
        position?: any;
        template?: any;
        visible?: any;
    }

    interface ChartSeriesItemLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesItemLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesItemLabelsToBorder {
        color?: any;
        dashType?: any;
        width?: any;
    }

    interface ChartSeriesItemLabelsToMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesItemLabelsToPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesItemLabelsTo {
        background?: any;
        border?: ChartSeriesItemLabelsToBorder;
        color?: any;
        font?: any;
        format?: any;
        margin?: ChartSeriesItemLabelsToMargin;
        padding?: ChartSeriesItemLabelsToPadding;
        position?: any;
        template?: any;
        visible?: any;
    }

    interface ChartSeriesItemLabels {
        align?: string;
        background?: any;
        border?: ChartSeriesItemLabelsBorder;
        color?: any;
        distance?: number;
        font?: any;
        format?: any;
        margin?: ChartSeriesItemLabelsMargin;
        padding?: ChartSeriesItemLabelsPadding;
        position?: any;
        template?: any;
        visible?: any;
        from?: ChartSeriesItemLabelsFrom;
        to?: ChartSeriesItemLabelsTo;
    }

    interface ChartSeriesItemLine {
        color?: string;
        opacity?: number;
        width?: string;
        style?: string;
    }

    interface ChartSeriesItemMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesItemMarkersBorder {
        color?: any;
        width?: any;
    }

    interface ChartSeriesItemMarkers {
        background?: any;
        border?: ChartSeriesItemMarkersBorder;
        size?: any;
        type?: any;
        visible?: any;
        rotation?: any;
    }

    interface ChartSeriesItemNegativeValues {
        color?: string;
        visible?: boolean;
    }

    interface ChartSeriesItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartSeriesItemNotesIcon {
        background?: string;
        border?: ChartSeriesItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartSeriesItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartSeriesItemNotesLabel {
        background?: string;
        border?: ChartSeriesItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface ChartSeriesItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartSeriesItemNotes {
        position?: string;
        icon?: ChartSeriesItemNotesIcon;
        label?: ChartSeriesItemNotesLabel;
        line?: ChartSeriesItemNotesLine;
    }

    interface ChartSeriesItemOutliersBorder {
        color?: any;
        width?: any;
    }

    interface ChartSeriesItemOutliers {
        background?: any;
        border?: ChartSeriesItemOutliersBorder;
        size?: any;
        type?: any;
        rotation?: any;
    }

    interface ChartSeriesItemOverlay {
        gradient?: string;
    }

    interface ChartSeriesItemStack {
        type?: string;
        group?: string;
    }

    interface ChartSeriesItemTargetBorder {
        color?: any;
        dashType?: any;
        width?: any;
    }

    interface ChartSeriesItemTargetLine {
        width?: any;
    }

    interface ChartSeriesItemTarget {
        border?: ChartSeriesItemTargetBorder;
        color?: any;
        line?: ChartSeriesItemTargetLine;
    }

    interface ChartSeriesItemTooltipBorder {
        color?: string;
        width?: number;
    }

    interface ChartSeriesItemTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesItemTooltip {
        background?: string;
        border?: ChartSeriesItemTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartSeriesItemTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartSeriesItem {
        aggregate?: string;
        axis?: string;
        border?: ChartSeriesItemBorder;
        categoryField?: string;
        closeField?: string;
        color?: any;
        colorField?: string;
        connectors?: ChartSeriesItemConnectors;
        currentField?: string;
        dashType?: string;
        data?: any;
        downColor?: any;
        downColorField?: string;
        segmentSpacing?: number;
        summaryField?: string;
        neckRatio?: number;
        dynamicSlope?: boolean;
        dynamicHeight?: boolean;
        errorBars?: ChartSeriesItemErrorBars;
        errorLowField?: string;
        errorHighField?: string;
        xErrorLowField?: string;
        xErrorHighField?: string;
        yErrorLowField?: string;
        yErrorHighField?: string;
        explodeField?: string;
        field?: string;
        fromField?: string;
        toField?: string;
        noteTextField?: string;
        lowerField?: string;
        q1Field?: string;
        medianField?: string;
        q3Field?: string;
        upperField?: string;
        meanField?: string;
        outliersField?: string;
        gap?: number;
        highField?: string;
        highlight?: ChartSeriesItemHighlight;
        holeSize?: number;
        labels?: ChartSeriesItemLabels;
        line?: ChartSeriesItemLine;
        lowField?: string;
        margin?: ChartSeriesItemMargin;
        markers?: ChartSeriesItemMarkers;
        outliers?: ChartSeriesItemOutliers;
        extremes?: ChartSeriesItemExtremes;
        maxSize?: number;
        minSize?: number;
        missingValues?: string;
        style?: string;
        name?: string;
        negativeColor?: string;
        negativeValues?: ChartSeriesItemNegativeValues;
        opacity?: number;
        openField?: string;
        overlay?: ChartSeriesItemOverlay;
        padding?: number;
        size?: number;
        sizeField?: string;
        spacing?: number;
        stack?: ChartSeriesItemStack;
        startAngle?: number;
        target?: ChartSeriesItemTarget;
        targetField?: string;
        tooltip?: ChartSeriesItemTooltip;
        type?: string;
        visibleInLegend?: boolean;
        visibleInLegendField?: string;
        width?: number;
        xAxis?: string;
        xField?: string;
        yAxis?: string;
        yField?: string;
        notes?: ChartSeriesItemNotes;
    }

    interface ChartSeriesDefaultsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartSeriesDefaultsLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartSeriesDefaultsLabelsFromBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartSeriesDefaultsLabelsFromMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesDefaultsLabelsFromPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesDefaultsLabelsFrom {
        background?: string;
        border?: ChartSeriesDefaultsLabelsFromBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: ChartSeriesDefaultsLabelsFromMargin;
        padding?: ChartSeriesDefaultsLabelsFromPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartSeriesDefaultsLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesDefaultsLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesDefaultsLabelsToBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartSeriesDefaultsLabelsToMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesDefaultsLabelsToPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesDefaultsLabelsTo {
        background?: string;
        border?: ChartSeriesDefaultsLabelsToBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: ChartSeriesDefaultsLabelsToMargin;
        padding?: ChartSeriesDefaultsLabelsToPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartSeriesDefaultsLabels {
        background?: string;
        border?: ChartSeriesDefaultsLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: ChartSeriesDefaultsLabelsMargin;
        padding?: ChartSeriesDefaultsLabelsPadding;
        template?: any;
        visible?: boolean;
        from?: ChartSeriesDefaultsLabelsFrom;
        to?: ChartSeriesDefaultsLabelsTo;
    }

    interface ChartSeriesDefaultsNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartSeriesDefaultsNotesIcon {
        background?: string;
        border?: ChartSeriesDefaultsNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartSeriesDefaultsNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartSeriesDefaultsNotesLabel {
        background?: string;
        border?: ChartSeriesDefaultsNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface ChartSeriesDefaultsNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartSeriesDefaultsNotes {
        icon?: ChartSeriesDefaultsNotesIcon;
        label?: ChartSeriesDefaultsNotesLabel;
        line?: ChartSeriesDefaultsNotesLine;
    }

    interface ChartSeriesDefaultsOverlay {
        gradient?: string;
    }

    interface ChartSeriesDefaultsStack {
        type?: string;
    }

    interface ChartSeriesDefaultsTooltipBorder {
        color?: string;
        width?: number;
    }

    interface ChartSeriesDefaultsTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartSeriesDefaultsTooltip {
        background?: string;
        border?: ChartSeriesDefaultsTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartSeriesDefaultsTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartSeriesDefaults {
        area?: any;
        bar?: any;
        border?: ChartSeriesDefaultsBorder;
        bubble?: any;
        candlestick?: any;
        column?: any;
        donut?: any;
        gap?: number;
        labels?: ChartSeriesDefaultsLabels;
        line?: any;
        ohlc?: any;
        overlay?: ChartSeriesDefaultsOverlay;
        pie?: any;
        scatter?: any;
        scatterLine?: any;
        spacing?: number;
        stack?: ChartSeriesDefaultsStack;
        type?: string;
        tooltip?: ChartSeriesDefaultsTooltip;
        verticalArea?: any;
        verticalLine?: any;
        notes?: ChartSeriesDefaultsNotes;
    }

    interface ChartTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartTitlePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartTitle {
        align?: string;
        background?: string;
        border?: ChartTitleBorder;
        font?: string;
        margin?: ChartTitleMargin;
        padding?: ChartTitlePadding;
        position?: string;
        text?: string;
        visible?: boolean;
    }

    interface ChartTooltipBorder {
        color?: string;
        width?: number;
    }

    interface ChartTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartTooltip {
        background?: string;
        border?: ChartTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartTooltipPadding;
        shared?: boolean;
        sharedTemplate?: any;
        template?: any;
        visible?: boolean;
    }

    interface ChartValueAxisItemCrosshairTooltipBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartValueAxisItemCrosshairTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartValueAxisItemCrosshairTooltip {
        background?: string;
        border?: ChartValueAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartValueAxisItemCrosshairTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartValueAxisItemCrosshair {
        color?: string;
        opacity?: number;
        tooltip?: ChartValueAxisItemCrosshairTooltip;
        visible?: boolean;
        width?: number;
    }

    interface ChartValueAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartValueAxisItemLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartValueAxisItemLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartValueAxisItemLabels {
        background?: string;
        border?: ChartValueAxisItemLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: ChartValueAxisItemLabelsMargin;
        mirror?: boolean;
        padding?: ChartValueAxisItemLabelsPadding;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface ChartValueAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface ChartValueAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        type?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartValueAxisItemMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        step?: number;
        skip?: number;
    }

    interface ChartValueAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        type?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartValueAxisItemMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartValueAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartValueAxisItemNotesDataItemIcon {
        background?: string;
        border?: ChartValueAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartValueAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartValueAxisItemNotesDataItemLabel {
        background?: string;
        border?: ChartValueAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface ChartValueAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartValueAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: ChartValueAxisItemNotesDataItemIcon;
        label?: ChartValueAxisItemNotesDataItemLabel;
        line?: ChartValueAxisItemNotesDataItemLine;
    }

    interface ChartValueAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartValueAxisItemNotesIcon {
        background?: string;
        border?: ChartValueAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartValueAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartValueAxisItemNotesLabel {
        background?: string;
        border?: ChartValueAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface ChartValueAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartValueAxisItemNotes {
        position?: string;
        icon?: ChartValueAxisItemNotesIcon;
        label?: ChartValueAxisItemNotesLabel;
        line?: ChartValueAxisItemNotesLine;
        data?: ChartValueAxisItemNotesDataItem[];
    }

    interface ChartValueAxisItemPlotBand {
        color?: string;
        from?: number;
        opacity?: number;
        to?: number;
    }

    interface ChartValueAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartValueAxisItemTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartValueAxisItemTitlePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartValueAxisItemTitle {
        background?: string;
        border?: ChartValueAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: ChartValueAxisItemTitleMargin;
        padding?: ChartValueAxisItemTitlePadding;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface ChartValueAxisItem {
        axisCrossingValue?: any;
        background?: string;
        color?: string;
        crosshair?: ChartValueAxisItemCrosshair;
        labels?: ChartValueAxisItemLabels;
        line?: ChartValueAxisItemLine;
        majorGridLines?: ChartValueAxisItemMajorGridLines;
        majorUnit?: number;
        max?: number;
        min?: number;
        minorGridLines?: ChartValueAxisItemMinorGridLines;
        majorTicks?: ChartValueAxisItemMajorTicks;
        minorTicks?: ChartValueAxisItemMinorTicks;
        minorUnit?: number;
        name?: any;
        narrowRange?: boolean;
        pane?: string;
        plotBands?: ChartValueAxisItemPlotBand[];
        reverse?: boolean;
        title?: ChartValueAxisItemTitle;
        type?: string;
        visible?: boolean;
        notes?: ChartValueAxisItemNotes;
    }

    interface ChartXAxisItemCrosshairTooltipBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartXAxisItemCrosshairTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartXAxisItemCrosshairTooltip {
        background?: string;
        border?: ChartXAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartXAxisItemCrosshairTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartXAxisItemCrosshair {
        color?: string;
        opacity?: number;
        tooltip?: ChartXAxisItemCrosshairTooltip;
        visible?: boolean;
        width?: number;
    }

    interface ChartXAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartXAxisItemLabelsDateFormats {
        days?: string;
        hours?: string;
        months?: string;
        weeks?: string;
        years?: string;
    }

    interface ChartXAxisItemLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartXAxisItemLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartXAxisItemLabels {
        background?: string;
        border?: ChartXAxisItemLabelsBorder;
        color?: string;
        culture?: string;
        dateFormats?: ChartXAxisItemLabelsDateFormats;
        font?: string;
        format?: string;
        margin?: ChartXAxisItemLabelsMargin;
        mirror?: boolean;
        padding?: ChartXAxisItemLabelsPadding;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface ChartXAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface ChartXAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartXAxisItemMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartXAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartXAxisItemMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartXAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartXAxisItemNotesDataItemIcon {
        background?: string;
        border?: ChartXAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartXAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartXAxisItemNotesDataItemLabel {
        background?: string;
        border?: ChartXAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface ChartXAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartXAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: ChartXAxisItemNotesDataItemIcon;
        label?: ChartXAxisItemNotesDataItemLabel;
        line?: ChartXAxisItemNotesDataItemLine;
    }

    interface ChartXAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartXAxisItemNotesIcon {
        background?: string;
        border?: ChartXAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartXAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartXAxisItemNotesLabel {
        background?: string;
        border?: ChartXAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface ChartXAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartXAxisItemNotes {
        position?: string;
        icon?: ChartXAxisItemNotesIcon;
        label?: ChartXAxisItemNotesLabel;
        line?: ChartXAxisItemNotesLine;
        data?: ChartXAxisItemNotesDataItem[];
    }

    interface ChartXAxisItemPlotBand {
        color?: string;
        from?: number;
        opacity?: number;
        to?: number;
    }

    interface ChartXAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartXAxisItemTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartXAxisItemTitlePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartXAxisItemTitle {
        background?: string;
        border?: ChartXAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: ChartXAxisItemTitleMargin;
        padding?: ChartXAxisItemTitlePadding;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface ChartXAxisItem {
        axisCrossingValue?: any;
        background?: string;
        baseUnit?: string;
        color?: string;
        crosshair?: ChartXAxisItemCrosshair;
        labels?: ChartXAxisItemLabels;
        line?: ChartXAxisItemLine;
        majorGridLines?: ChartXAxisItemMajorGridLines;
        minorGridLines?: ChartXAxisItemMinorGridLines;
        minorTicks?: ChartXAxisItemMinorTicks;
        majorTicks?: ChartXAxisItemMajorTicks;
        majorUnit?: number;
        max?: any;
        min?: any;
        minorUnit?: number;
        name?: any;
        narrowRange?: boolean;
        pane?: string;
        plotBands?: ChartXAxisItemPlotBand[];
        reverse?: boolean;
        startAngle?: number;
        title?: ChartXAxisItemTitle;
        type?: string;
        visible?: boolean;
        notes?: ChartXAxisItemNotes;
    }

    interface ChartYAxisItemCrosshairTooltipBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartYAxisItemCrosshairTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartYAxisItemCrosshairTooltip {
        background?: string;
        border?: ChartYAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: ChartYAxisItemCrosshairTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface ChartYAxisItemCrosshair {
        color?: string;
        opacity?: number;
        tooltip?: ChartYAxisItemCrosshairTooltip;
        visible?: boolean;
        width?: number;
    }

    interface ChartYAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartYAxisItemLabelsDateFormats {
        days?: string;
        hours?: string;
        months?: string;
        weeks?: string;
        years?: string;
    }

    interface ChartYAxisItemLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartYAxisItemLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartYAxisItemLabels {
        background?: string;
        border?: ChartYAxisItemLabelsBorder;
        color?: string;
        culture?: string;
        dateFormats?: ChartYAxisItemLabelsDateFormats;
        font?: string;
        format?: string;
        margin?: ChartYAxisItemLabelsMargin;
        mirror?: boolean;
        padding?: ChartYAxisItemLabelsPadding;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface ChartYAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface ChartYAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartYAxisItemMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartYAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartYAxisItemMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface ChartYAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartYAxisItemNotesDataItemIcon {
        background?: string;
        border?: ChartYAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartYAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartYAxisItemNotesDataItemLabel {
        background?: string;
        border?: ChartYAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface ChartYAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartYAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: ChartYAxisItemNotesDataItemIcon;
        label?: ChartYAxisItemNotesDataItemLabel;
        line?: ChartYAxisItemNotesDataItemLine;
    }

    interface ChartYAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface ChartYAxisItemNotesIcon {
        background?: string;
        border?: ChartYAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface ChartYAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartYAxisItemNotesLabel {
        background?: string;
        border?: ChartYAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface ChartYAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface ChartYAxisItemNotes {
        position?: string;
        icon?: ChartYAxisItemNotesIcon;
        label?: ChartYAxisItemNotesLabel;
        line?: ChartYAxisItemNotesLine;
        data?: ChartYAxisItemNotesDataItem[];
    }

    interface ChartYAxisItemPlotBand {
        color?: string;
        from?: number;
        opacity?: number;
        to?: number;
    }

    interface ChartYAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface ChartYAxisItemTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartYAxisItemTitlePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface ChartYAxisItemTitle {
        background?: string;
        border?: ChartYAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: ChartYAxisItemTitleMargin;
        padding?: ChartYAxisItemTitlePadding;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface ChartYAxisItem {
        axisCrossingValue?: any;
        background?: string;
        baseUnit?: string;
        color?: string;
        crosshair?: ChartYAxisItemCrosshair;
        labels?: ChartYAxisItemLabels;
        line?: ChartYAxisItemLine;
        majorGridLines?: ChartYAxisItemMajorGridLines;
        minorGridLines?: ChartYAxisItemMinorGridLines;
        minorTicks?: ChartYAxisItemMinorTicks;
        majorTicks?: ChartYAxisItemMajorTicks;
        majorUnit?: number;
        max?: any;
        min?: any;
        minorUnit?: number;
        name?: any;
        narrowRange?: boolean;
        pane?: string;
        plotBands?: ChartYAxisItemPlotBand[];
        reverse?: boolean;
        title?: ChartYAxisItemTitle;
        type?: string;
        visible?: boolean;
        notes?: ChartYAxisItemNotes;
    }

    interface ChartSeriesClickEventSeries {
        type?: any;
        name?: any;
        data?: any;
    }

    interface ChartSeriesHoverEventSeries {
        type?: any;
        name?: any;
        data?: any;
    }

    interface ChartOptions {
        name?: string;
        autoBind?: boolean;
        axisDefaults?: any;
        categoryAxis?: ChartCategoryAxisItem[];
        chartArea?: ChartChartArea;
        dataSource?: any;
        legend?: ChartLegend;
        panes?: ChartPane[];
        plotArea?: ChartPlotArea;
        renderAs?: string;
        series?: ChartSeriesItem[];
        seriesColors?: any;
        seriesDefaults?: ChartSeriesDefaults;
        theme?: string;
        title?: ChartTitle;
        tooltip?: ChartTooltip;
        transitions?: boolean;
        valueAxis?: ChartValueAxisItem[];
        xAxis?: ChartXAxisItem[];
        yAxis?: ChartYAxisItem[];
        axisLabelClick?(e: ChartAxisLabelClickEvent): void;
        legendItemClick?(e: ChartLegendItemClickEvent): void;
        legendItemHover?(e: ChartLegendItemHoverEvent): void;
        dataBound?(e: ChartDataBoundEvent): void;
        drag?(e: ChartDragEvent): void;
        dragEnd?(e: ChartDragEndEvent): void;
        dragStart?(e: ChartDragStartEvent): void;
        noteClick?(e: ChartNoteClickEvent): void;
        noteHover?(e: ChartNoteHoverEvent): void;
        plotAreaClick?(e: ChartPlotAreaClickEvent): void;
        select?(e: ChartSelectEvent): void;
        selectEnd?(e: ChartSelectEndEvent): void;
        selectStart?(e: ChartSelectStartEvent): void;
        seriesClick?(e: ChartSeriesClickEvent): void;
        seriesHover?(e: ChartSeriesHoverEvent): void;
        zoom?(e: ChartZoomEvent): void;
        zoomEnd?(e: ChartZoomEndEvent): void;
        zoomStart?(e: ChartZoomStartEvent): void;
    }

    interface ChartEvent {
        sender: Chart;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ChartAxisLabelClickEvent extends ChartEvent {
        axis?: any;
        dataItem?: any;
        element?: any;
        index?: any;
        text?: string;
        value?: any;
    }

    interface ChartLegendItemClickEvent extends ChartEvent {
        text?: string;
        series?: any;
        seriesIndex?: number;
        pointIndex?: number;
        element?: any;
    }

    interface ChartLegendItemHoverEvent extends ChartEvent {
        text?: string;
        series?: any;
        seriesIndex?: number;
        pointIndex?: number;
        element?: any;
    }

    interface ChartDataBoundEvent extends ChartEvent {
    }

    interface ChartDragEvent extends ChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface ChartDragEndEvent extends ChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface ChartDragStartEvent extends ChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface ChartNoteClickEvent extends ChartEvent {
        category?: any;
        element?: any;
        value?: any;
        series?: any;
        dataItem?: any;
    }

    interface ChartNoteHoverEvent extends ChartEvent {
        category?: any;
        element?: any;
        value?: any;
        series?: any;
        dataItem?: any;
    }

    interface ChartPlotAreaClickEvent extends ChartEvent {
        category?: any;
        element?: any;
        value?: any;
        x?: any;
        y?: any;
    }

    interface ChartSelectEvent extends ChartEvent {
        axis?: any;
        from?: any;
        to?: any;
    }

    interface ChartSelectEndEvent extends ChartEvent {
        axis?: any;
        from?: any;
        to?: any;
    }

    interface ChartSelectStartEvent extends ChartEvent {
        axis?: any;
        from?: any;
        to?: any;
    }

    interface ChartSeriesClickEvent extends ChartEvent {
        category?: any;
        element?: any;
        series?: ChartSeriesClickEventSeries;
        dataItem?: any;
        value?: any;
        percentage?: any;
    }

    interface ChartSeriesHoverEvent extends ChartEvent {
        category?: any;
        element?: any;
        series?: ChartSeriesHoverEventSeries;
        dataItem?: any;
        value?: any;
        percentage?: any;
    }

    interface ChartZoomEvent extends ChartEvent {
        axisRanges?: any;
        delta?: number;
    }

    interface ChartZoomEndEvent extends ChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface ChartZoomStartEvent extends ChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }


    class Diagram extends kendo.ui.Widget {
        static fn: Diagram;
        static extend(proto: Object): Diagram;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: DiagramOptions);
        options: DiagramOptions;
        dataSource: kendo.data.DataSource;
        destroy(): void;
        resize(): void;
        zoom(zoom: number, point: any): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        save(): void;
        load(json: string): void;
        pan(pan: any): void;
        viewport(): void;
        viewToDocument(point: any): any;
        documentToView(point: any): any;
        viewToModel(point: any): any;
        modelToView(point: any): any;
        modelToLayer(point: any): any;
        layerToModel(point: any): any;
        documentToModel(point: any): any;
        modelToDocument(point: any): any;
        transformPoint(p: any): void;
        transformRect(r: any): void;
        focus(): void;
        clear(): void;
        connect(source: any, target: any, options: any): void;
        connected(source: any, target: any): void;
        addConnection(connection: any, undoable: boolean): void;
        addShape(obj: any, undoable: boolean): void;
        undo(): void;
        redo(): void;
        remove(items: any, undoable: boolean): void;
        select(obj: any, options: any): void;
        toFront(items: any, undoable: boolean): void;
        toBack(items: any, undoable: boolean): void;
        bringIntoView(obj: any, options: any): void;
        boundingBox(items: any): kendo.dataviz.diagram.Rect;
        copy(): void;
        cut(): void;
        paste(): void;
        layout(options: any): void;
        alignShapes(direction: string): void;
        getShapeById(id: string): any;
    }

    interface DiagramConnectionDefaultsHoverStroke {
        color?: string;
    }

    interface DiagramConnectionDefaultsHover {
        stroke?: DiagramConnectionDefaultsHoverStroke;
    }

    interface DiagramConnectionDefaultsSelectionHandlesFill {
        color?: string;
    }

    interface DiagramConnectionDefaultsSelectionHandlesStroke {
        color?: string;
    }

    interface DiagramConnectionDefaultsSelectionHandles {
        fill?: DiagramConnectionDefaultsSelectionHandlesFill;
        stroke?: DiagramConnectionDefaultsSelectionHandlesStroke;
    }

    interface DiagramConnectionDefaultsSelection {
        handles?: DiagramConnectionDefaultsSelectionHandles;
    }

    interface DiagramConnectionDefaultsStroke {
        color?: string;
        width?: number;
    }

    interface DiagramConnectionDefaults {
        stroke?: DiagramConnectionDefaultsStroke;
        hover?: DiagramConnectionDefaultsHover;
        startCap?: string;
        endCap?: string;
        selection?: DiagramConnectionDefaultsSelection;
    }

    interface DiagramConnectionHoverStroke {
        color?: string;
    }

    interface DiagramConnectionHover {
        stroke?: DiagramConnectionHoverStroke;
    }

    interface DiagramConnectionPoint {
        x?: number;
        y?: number;
    }

    interface DiagramConnectionSelectionHandlesFill {
        color?: string;
    }

    interface DiagramConnectionSelectionHandlesStroke {
        color?: string;
    }

    interface DiagramConnectionSelectionHandles {
        fill?: DiagramConnectionSelectionHandlesFill;
        stroke?: DiagramConnectionSelectionHandlesStroke;
    }

    interface DiagramConnectionSelection {
        handles?: DiagramConnectionSelectionHandles;
    }

    interface DiagramConnectionStroke {
        color?: string;
        width?: number;
    }

    interface DiagramConnection {
        stroke?: DiagramConnectionStroke;
        hover?: DiagramConnectionHover;
        startCap?: string;
        endCap?: string;
        points?: DiagramConnectionPoint[];
        selection?: DiagramConnectionSelection;
    }

    interface DiagramEditableResizeHandlesFill {
        color?: string;
        opacity?: number;
    }

    interface DiagramEditableResizeHandlesHoverFill {
        color?: string;
        opacity?: number;
    }

    interface DiagramEditableResizeHandlesHoverStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface DiagramEditableResizeHandlesHover {
        fill?: DiagramEditableResizeHandlesHoverFill;
        stroke?: DiagramEditableResizeHandlesHoverStroke;
    }

    interface DiagramEditableResizeHandlesStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface DiagramEditableResizeHandles {
        fill?: DiagramEditableResizeHandlesFill;
        stroke?: DiagramEditableResizeHandlesStroke;
        hover?: DiagramEditableResizeHandlesHover;
        width?: number;
        height?: number;
    }

    interface DiagramEditableResize {
        handles?: DiagramEditableResizeHandles;
    }

    interface DiagramEditableRotateThumbFill {
        color?: string;
        opacity?: number;
    }

    interface DiagramEditableRotateThumbStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface DiagramEditableRotateThumb {
        fill?: DiagramEditableRotateThumbFill;
        stroke?: DiagramEditableRotateThumbStroke;
    }

    interface DiagramEditableRotate {
        thumb?: DiagramEditableRotateThumb;
    }

    interface DiagramEditable {
        resize?: DiagramEditableResize;
        rotate?: DiagramEditableRotate;
    }

    interface DiagramLayoutGrid {
        width?: number;
        offsetX?: number;
        offsetY?: number;
        componentSpacingX?: number;
        componentSpacingY?: number;
    }

    interface DiagramLayout {
        type?: string;
        subtype?: string;
        horizontalSeparation?: number;
        verticalSeparation?: number;
        radialFirstLevelSeparation?: number;
        radialSeparation?: number;
        startRadialAngle?: number;
        endRadialAngle?: number;
        underneathVerticalTopOffset?: number;
        underneathVerticalSeparation?: number;
        underneathHorizontalOffset?: number;
        iterations?: number;
        nodeDistance?: number;
        grid?: DiagramLayoutGrid;
        layerSeparation?: number;
    }

    interface DiagramSelectableStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface DiagramSelectable {
        stroke?: DiagramSelectableStroke;
    }

    interface DiagramShapeDefaultsConnector {
        name?: string;
        description?: string;
        position?: any;
    }

    interface DiagramShapeDefaultsContent {
        text?: string;
        align?: string;
        fontFamily?: string;
        fontSize?: number;
        color?: string;
    }

    interface DiagramShapeDefaultsEditable {
        connect?: boolean;
    }

    interface DiagramShapeDefaultsFill {
        color?: string;
        opacity?: number;
    }

    interface DiagramShapeDefaultsHoverFill {
        color?: string;
        opacity?: number;
    }

    interface DiagramShapeDefaultsHover {
        fill?: DiagramShapeDefaultsHoverFill;
    }

    interface DiagramShapeDefaultsRotation {
        angle?: number;
    }

    interface DiagramShapeDefaultsStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface DiagramShapeDefaults {
        editable?: DiagramShapeDefaultsEditable;
        path?: string;
        stroke?: DiagramShapeDefaultsStroke;
        type?: string;
        x?: number;
        y?: number;
        minWidth?: number;
        minHeight?: number;
        width?: number;
        height?: number;
        fill?: DiagramShapeDefaultsFill;
        hover?: DiagramShapeDefaultsHover;
        connectors?: DiagramShapeDefaultsConnector[];
        rotation?: DiagramShapeDefaultsRotation;
        content?: DiagramShapeDefaultsContent;
        source?: string;
        visual?: Function;
    }

    interface DiagramShapeConnector {
        name?: string;
        description?: string;
        position?: any;
    }

    interface DiagramShapeContent {
        text?: string;
        align?: string;
        fontFamily?: string;
        fontSize?: number;
        color?: string;
    }

    interface DiagramShapeEditable {
        connect?: boolean;
    }

    interface DiagramShapeFill {
        color?: string;
        opacity?: number;
    }

    interface DiagramShapeHoverFill {
        color?: string;
        opacity?: number;
    }

    interface DiagramShapeHover {
        fill?: DiagramShapeHoverFill;
    }

    interface DiagramShapeRotation {
        angle?: number;
    }

    interface DiagramShapeStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface DiagramShape {
        id?: string;
        editable?: DiagramShapeEditable;
        path?: string;
        stroke?: DiagramShapeStroke;
        type?: string;
        x?: number;
        y?: number;
        minWidth?: number;
        minHeight?: number;
        width?: number;
        height?: number;
        fill?: DiagramShapeFill;
        hover?: DiagramShapeHover;
        connectors?: DiagramShapeConnector[];
        rotation?: DiagramShapeRotation;
        content?: DiagramShapeContent;
        source?: string;
        visual?: Function;
    }

    interface DiagramOptions {
        name?: string;
        autoBind?: boolean;
        zoomRate?: number;
        zoom?: number;
        zoomMin?: number;
        zoomMax?: number;
        editable?: DiagramEditable;
        dataSource?: any;
        layout?: DiagramLayout;
        template?: any;
        connectionDefaults?: DiagramConnectionDefaults;
        connections?: DiagramConnection[];
        selectable?: DiagramSelectable;
        shapeDefaults?: DiagramShapeDefaults;
        shapes?: DiagramShape[];
        change?(e: DiagramChangeEvent): void;
        itemBoundsChange?(e: DiagramItemBoundsChangeEvent): void;
        itemRotate?(e: DiagramItemRotateEvent): void;
        pan?(e: DiagramPanEvent): void;
        select?(e: DiagramSelectEvent): void;
        zoomStart?(e: DiagramZoomStartEvent): void;
        zoomEnd?(e: DiagramZoomEndEvent): void;
        click?(e: DiagramClickEvent): void;
    }

    interface DiagramEvent {
        sender: Diagram;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface DiagramChangeEvent extends DiagramEvent {
        added?: any;
        removed?: any;
    }

    interface DiagramItemBoundsChangeEvent extends DiagramEvent {
        bounds?: kendo.dataviz.diagram.Rect;
        item?: any;
    }

    interface DiagramItemRotateEvent extends DiagramEvent {
        item?: any;
    }

    interface DiagramPanEvent extends DiagramEvent {
    }

    interface DiagramSelectEvent extends DiagramEvent {
        selected?: any;
        deselected?: any;
    }

    interface DiagramZoomStartEvent extends DiagramEvent {
        point?: kendo.dataviz.diagram.Point;
        zoom?: number;
    }

    interface DiagramZoomEndEvent extends DiagramEvent {
        point?: kendo.dataviz.diagram.Point;
        zoom?: number;
    }

    interface DiagramClickEvent extends DiagramEvent {
        item?: any;
        point?: kendo.dataviz.diagram.Point;
    }


    class LinearGauge extends kendo.ui.Widget {
        static fn: LinearGauge;
        static extend(proto: Object): LinearGauge;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: LinearGaugeOptions);
        options: LinearGaugeOptions;
        destroy(): void;
        redraw(): void;
        resize(force?: boolean): void;
        svg(): void;
        imageDataURL(): string;
        value(): void;
    }

    interface LinearGaugeGaugeAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface LinearGaugeGaugeArea {
        background?: any;
        border?: LinearGaugeGaugeAreaBorder;
        height?: number;
        margin?: any;
        width?: number;
    }

    interface LinearGaugePointerBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface LinearGaugePointerTrackBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface LinearGaugePointerTrack {
        border?: LinearGaugePointerTrackBorder;
        color?: string;
        opacity?: number;
        size?: number;
        visible?: boolean;
    }

    interface LinearGaugePointer {
        border?: LinearGaugePointerBorder;
        color?: string;
        margin?: any;
        opacity?: number;
        shape?: string;
        size?: number;
        track?: LinearGaugePointerTrack;
        value?: number;
    }

    interface LinearGaugeScaleLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface LinearGaugeScaleLabels {
        background?: string;
        border?: LinearGaugeScaleLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface LinearGaugeScaleLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface LinearGaugeScaleMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
    }

    interface LinearGaugeScaleMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
    }

    interface LinearGaugeScaleRange {
        from?: number;
        to?: number;
        opacity?: number;
        color?: string;
    }

    interface LinearGaugeScale {
        line?: LinearGaugeScaleLine;
        labels?: LinearGaugeScaleLabels;
        majorTicks?: LinearGaugeScaleMajorTicks;
        majorUnit?: number;
        max?: number;
        min?: number;
        minorTicks?: LinearGaugeScaleMinorTicks;
        minorUnit?: number;
        mirror?: boolean;
        ranges?: LinearGaugeScaleRange[];
        rangePlaceholderColor?: string;
        rangeSize?: number;
        reverse?: boolean;
        vertical?: boolean;
    }

    interface LinearGaugeOptions {
        name?: string;
        gaugeArea?: LinearGaugeGaugeArea;
        pointer?: LinearGaugePointer;
        renderAs?: string;
        scale?: LinearGaugeScale;
        transitions?: boolean;
    }

    interface LinearGaugeEvent {
        sender: LinearGauge;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Map extends kendo.ui.Widget {
        static fn: Map;
        static extend(proto: Object): Map;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: MapOptions);
        options: MapOptions;
        center(): kendo.dataviz.map.Location;
        center(center: any): void;
        center(center: kendo.dataviz.map.Location): void;
        destroy(): void;
        eventOffset(e: any): kendo.dataviz.geometry.Point;
        eventOffset(e: JQueryEventObject): kendo.dataviz.geometry.Point;
        eventToLayer(e: any): kendo.dataviz.geometry.Point;
        eventToLayer(e: JQueryEventObject): kendo.dataviz.geometry.Point;
        eventToLocation(e: any): kendo.dataviz.geometry.Point;
        eventToLocation(e: JQueryEventObject): kendo.dataviz.geometry.Point;
        eventToView(e: any): kendo.dataviz.geometry.Point;
        eventToView(e: JQueryEventObject): kendo.dataviz.geometry.Point;
        extent(): kendo.dataviz.map.Extent;
        layerToLocation(point: any, zoom: number): kendo.dataviz.map.Location;
        layerToLocation(point: kendo.dataviz.geometry.Point, zoom: number): kendo.dataviz.map.Location;
        locationToLayer(location: any, zoom: number): kendo.dataviz.geometry.Point;
        locationToLayer(location: kendo.dataviz.map.Location, zoom: number): kendo.dataviz.geometry.Point;
        locationToView(location: any): kendo.dataviz.geometry.Point;
        locationToView(location: kendo.dataviz.map.Location): kendo.dataviz.geometry.Point;
        resize(force?: boolean): void;
        setOptions(options: any): void;
        viewSize(): any;
        viewToLocation(point: any, zoom: number): kendo.dataviz.map.Location;
        viewToLocation(point: kendo.dataviz.geometry.Point, zoom: number): kendo.dataviz.map.Location;
        zoom(): number;
        zoom(level: number): void;
    }

    interface MapControlsAttribution {
        position?: string;
    }

    interface MapControlsNavigator {
        position?: string;
    }

    interface MapControlsZoom {
        position?: string;
    }

    interface MapControls {
        attribution?: MapControlsAttribution;
        navigator?: MapControlsNavigator;
        zoom?: MapControlsZoom;
    }

    interface MapLayerDefaultsBing {
        attribution?: string;
        opacity?: number;
        key?: string;
        imagerySet?: string;
    }

    interface MapLayerDefaultsBubbleStyleFill {
        color?: string;
        opacity?: number;
    }

    interface MapLayerDefaultsBubbleStyleStroke {
        color?: string;
        dashType?: string;
        opacity?: number;
        width?: number;
    }

    interface MapLayerDefaultsBubbleStyle {
        fill?: MapLayerDefaultsBubbleStyleFill;
        stroke?: MapLayerDefaultsBubbleStyleStroke;
    }

    interface MapLayerDefaultsBubble {
        attribution?: string;
        opacity?: number;
        maxSize?: number;
        minSize?: number;
        style?: MapLayerDefaultsBubbleStyle;
        symbol?: any;
    }

    interface MapLayerDefaultsMarkerTooltipAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface MapLayerDefaultsMarkerTooltipAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface MapLayerDefaultsMarkerTooltipAnimation {
        close?: MapLayerDefaultsMarkerTooltipAnimationClose;
        open?: MapLayerDefaultsMarkerTooltipAnimationOpen;
    }

    interface MapLayerDefaultsMarkerTooltipContent {
        url?: string;
    }

    interface MapLayerDefaultsMarkerTooltip {
        autoHide?: boolean;
        animation?: MapLayerDefaultsMarkerTooltipAnimation;
        content?: MapLayerDefaultsMarkerTooltipContent;
        template?: string;
        callout?: boolean;
        iframe?: boolean;
        height?: number;
        width?: number;
        position?: string;
        showAfter?: number;
        showOn?: string;
    }

    interface MapLayerDefaultsMarker {
        shape?: string;
        tooltip?: MapLayerDefaultsMarkerTooltip;
        opacity?: number;
    }

    interface MapLayerDefaultsShapeStyleFill {
        color?: string;
        opacity?: number;
    }

    interface MapLayerDefaultsShapeStyleStroke {
        color?: string;
        dashType?: string;
        opacity?: number;
        width?: number;
    }

    interface MapLayerDefaultsShapeStyle {
        fill?: MapLayerDefaultsShapeStyleFill;
        stroke?: MapLayerDefaultsShapeStyleStroke;
    }

    interface MapLayerDefaultsShape {
        attribution?: string;
        opacity?: number;
        style?: MapLayerDefaultsShapeStyle;
    }

    interface MapLayerDefaultsTile {
        urlTemplate?: string;
        attribution?: string;
        subdomains?: any;
        opacity?: number;
    }

    interface MapLayerDefaults {
        marker?: MapLayerDefaultsMarker;
        shape?: MapLayerDefaultsShape;
        bubble?: MapLayerDefaultsBubble;
        tile?: MapLayerDefaultsTile;
        bing?: MapLayerDefaultsBing;
    }

    interface MapLayerStyleFill {
        color?: string;
        opacity?: number;
    }

    interface MapLayerStyleStroke {
        color?: string;
        dashType?: number;
        opacity?: number;
        width?: number;
    }

    interface MapLayerStyle {
        fill?: MapLayerStyleFill;
        stroke?: MapLayerStyleStroke;
    }

    interface MapLayerTooltipAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface MapLayerTooltipAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface MapLayerTooltipAnimation {
        close?: MapLayerTooltipAnimationClose;
        open?: MapLayerTooltipAnimationOpen;
    }

    interface MapLayerTooltipContent {
        url?: string;
    }

    interface MapLayerTooltip {
        autoHide?: boolean;
        animation?: MapLayerTooltipAnimation;
        content?: MapLayerTooltipContent;
        template?: string;
        callout?: boolean;
        iframe?: boolean;
        height?: number;
        width?: number;
        position?: string;
        showAfter?: number;
        showOn?: string;
    }

    interface MapLayer {
        attribution?: string;
        autoBind?: boolean;
        dataSource?: any;
        extent?: any;
        key?: string;
        imagerySet?: string;
        locationField?: string;
        shape?: string;
        titleField?: string;
        tooltip?: MapLayerTooltip;
        maxSize?: number;
        minSize?: number;
        opacity?: number;
        subdomains?: any;
        symbol?: any;
        type?: string;
        style?: MapLayerStyle;
        urlTemplate?: string;
        valueField?: string;
    }

    interface MapMarkerDefaultsTooltipAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface MapMarkerDefaultsTooltipAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface MapMarkerDefaultsTooltipAnimation {
        close?: MapMarkerDefaultsTooltipAnimationClose;
        open?: MapMarkerDefaultsTooltipAnimationOpen;
    }

    interface MapMarkerDefaultsTooltipContent {
        url?: string;
    }

    interface MapMarkerDefaultsTooltip {
        autoHide?: boolean;
        animation?: MapMarkerDefaultsTooltipAnimation;
        content?: MapMarkerDefaultsTooltipContent;
        template?: string;
        callout?: boolean;
        iframe?: boolean;
        height?: number;
        width?: number;
        position?: string;
        showAfter?: number;
        showOn?: string;
    }

    interface MapMarkerDefaults {
        shape?: string;
        tooltip?: MapMarkerDefaultsTooltip;
    }

    interface MapMarkerTooltipAnimationClose {
        effects?: string;
        duration?: number;
    }

    interface MapMarkerTooltipAnimationOpen {
        effects?: string;
        duration?: number;
    }

    interface MapMarkerTooltipAnimation {
        close?: MapMarkerTooltipAnimationClose;
        open?: MapMarkerTooltipAnimationOpen;
    }

    interface MapMarkerTooltipContent {
        url?: string;
    }

    interface MapMarkerTooltip {
        autoHide?: boolean;
        animation?: MapMarkerTooltipAnimation;
        content?: MapMarkerTooltipContent;
        template?: string;
        callout?: boolean;
        iframe?: boolean;
        height?: number;
        width?: number;
        position?: string;
        showAfter?: number;
        showOn?: string;
    }

    interface MapMarker {
        location?: any;
        shape?: string;
        title?: string;
        tooltip?: MapMarkerTooltip;
    }

    interface MapOptions {
        name?: string;
        center?: any;
        controls?: MapControls;
        layerDefaults?: MapLayerDefaults;
        layers?: MapLayer[];
        markerDefaults?: MapMarkerDefaults;
        markers?: MapMarker[];
        minZoom?: number;
        maxZoom?: number;
        minSize?: number;
        pannable?: boolean;
        wraparound?: boolean;
        zoom?: number;
        zoomable?: boolean;
        click?(e: MapClickEvent): void;
        markerCreated?(e: MapMarkerCreatedEvent): void;
        pan?(e: MapPanEvent): void;
        panEnd?(e: MapPanEndEvent): void;
        reset?(e: MapResetEvent): void;
        shapeClick?(e: MapShapeClickEvent): void;
        shapeCreated?(e: MapShapeCreatedEvent): void;
        shapeMouseEnter?(e: MapShapeMouseEnterEvent): void;
        shapeMouseLeave?(e: MapShapeMouseLeaveEvent): void;
        zoomStart?(e: MapZoomStartEvent): void;
        zoomEnd?(e: MapZoomEndEvent): void;
    }

    interface MapEvent {
        sender: Map;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface MapClickEvent extends MapEvent {
        location?: kendo.dataviz.map.Location;
        originalEvent?: any;
    }

    interface MapMarkerCreatedEvent extends MapEvent {
        marker?: kendo.dataviz.map.Marker;
    }

    interface MapPanEvent extends MapEvent {
        origin?: kendo.dataviz.map.Location;
        center?: kendo.dataviz.map.Location;
        originalEvent?: any;
    }

    interface MapPanEndEvent extends MapEvent {
        origin?: kendo.dataviz.map.Location;
        center?: kendo.dataviz.map.Location;
        originalEvent?: any;
    }

    interface MapResetEvent extends MapEvent {
    }

    interface MapShapeClickEvent extends MapEvent {
        layer?: kendo.dataviz.map.layer.Shape;
        shape?: kendo.dataviz.drawing.Shape;
        originalEvent?: any;
    }

    interface MapShapeCreatedEvent extends MapEvent {
        layer?: kendo.dataviz.map.layer.Shape;
        shape?: kendo.dataviz.drawing.Shape;
        originalEvent?: any;
    }

    interface MapShapeMouseEnterEvent extends MapEvent {
        layer?: kendo.dataviz.map.layer.Shape;
        shape?: kendo.dataviz.drawing.Shape;
        originalEvent?: any;
    }

    interface MapShapeMouseLeaveEvent extends MapEvent {
        layer?: kendo.dataviz.map.layer.Shape;
        shape?: kendo.dataviz.drawing.Shape;
        originalEvent?: any;
    }

    interface MapZoomStartEvent extends MapEvent {
        originalEvent?: any;
    }

    interface MapZoomEndEvent extends MapEvent {
        originalEvent?: any;
    }


    class QRCode extends kendo.ui.Widget {
        static fn: QRCode;
        static extend(proto: Object): QRCode;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: QRCodeOptions);
        options: QRCodeOptions;
        destroy(): void;
        imageDataURL(): string;
        redraw(): void;
        resize(force?: boolean): void;
        setOptions(options: any): void;
        svg(): string;
        value(options: string): void;
        value(options: number): void;
    }

    interface QRCodeBorder {
        color?: string;
        width?: number;
    }

    interface QRCodeOptions {
        name?: string;
        background?: string;
        border?: QRCodeBorder;
        color?: string;
        encoding?: string;
        errorCorrection?: string;
        padding?: number;
        renderAs?: string;
        size?: any;
        value?: any;
    }

    interface QRCodeEvent {
        sender: QRCode;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class RadialGauge extends kendo.ui.Widget {
        static fn: RadialGauge;
        static extend(proto: Object): RadialGauge;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: RadialGaugeOptions);
        options: RadialGaugeOptions;
        destroy(): void;
        redraw(): void;
        resize(force?: boolean): void;
        svg(): void;
        imageDataURL(): string;
        value(): void;
    }

    interface RadialGaugeGaugeAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface RadialGaugeGaugeArea {
        background?: any;
        border?: RadialGaugeGaugeAreaBorder;
        height?: number;
        margin?: any;
        width?: number;
    }

    interface RadialGaugePointerCap {
        color?: string;
        size?: number;
    }

    interface RadialGaugePointer {
        cap?: RadialGaugePointerCap;
        color?: string;
        value?: number;
    }

    interface RadialGaugeScaleLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface RadialGaugeScaleLabels {
        background?: string;
        border?: RadialGaugeScaleLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        padding?: any;
        position?: string;
        template?: any;
        visible?: boolean;
    }

    interface RadialGaugeScaleMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
    }

    interface RadialGaugeScaleMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
    }

    interface RadialGaugeScaleRange {
        from?: number;
        to?: number;
        opacity?: number;
        color?: string;
    }

    interface RadialGaugeScale {
        endAngle?: number;
        labels?: RadialGaugeScaleLabels;
        majorTicks?: RadialGaugeScaleMajorTicks;
        majorUnit?: number;
        max?: number;
        min?: number;
        minorTicks?: RadialGaugeScaleMinorTicks;
        minorUnit?: number;
        ranges?: RadialGaugeScaleRange[];
        rangePlaceholderColor?: string;
        rangeSize?: number;
        rangeDistance?: number;
        reverse?: boolean;
        startAngle?: number;
    }

    interface RadialGaugeOptions {
        name?: string;
        gaugeArea?: RadialGaugeGaugeArea;
        pointer?: RadialGaugePointer;
        renderAs?: string;
        scale?: RadialGaugeScale;
        transitions?: boolean;
    }

    interface RadialGaugeEvent {
        sender: RadialGauge;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Sparkline extends kendo.ui.Widget {
        static fn: Sparkline;
        static extend(proto: Object): Sparkline;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: SparklineOptions);
        options: SparklineOptions;
        dataSource: kendo.data.DataSource;
        destroy(): void;
        refresh(): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        setOptions(options: any): void;
        svg(): string;
        imageDataURL(): string;
    }

    interface SparklineCategoryAxisItemCrosshairTooltipBorder {
        color?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemCrosshairTooltip {
        background?: string;
        border?: SparklineCategoryAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface SparklineCategoryAxisItemCrosshair {
        color?: string;
        width?: number;
        opacity?: number;
        dashType?: number;
        visible?: boolean;
        tooltip?: SparklineCategoryAxisItemCrosshairTooltip;
    }

    interface SparklineCategoryAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemLabels {
        background?: string;
        border?: SparklineCategoryAxisItemLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        mirror?: boolean;
        padding?: any;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
        culture?: string;
        dateFormats?: any;
    }

    interface SparklineCategoryAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface SparklineCategoryAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineCategoryAxisItemMajorTicks {
        size?: number;
        visible?: boolean;
        color?: string;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineCategoryAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineCategoryAxisItemMinorTicks {
        size?: number;
        visible?: boolean;
        color?: string;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineCategoryAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemNotesDataItemIcon {
        background?: string;
        border?: SparklineCategoryAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface SparklineCategoryAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemNotesDataItemLabel {
        background?: string;
        border?: SparklineCategoryAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface SparklineCategoryAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface SparklineCategoryAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: SparklineCategoryAxisItemNotesDataItemIcon;
        label?: SparklineCategoryAxisItemNotesDataItemLabel;
        line?: SparklineCategoryAxisItemNotesDataItemLine;
    }

    interface SparklineCategoryAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemNotesIcon {
        background?: string;
        border?: SparklineCategoryAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface SparklineCategoryAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemNotesLabel {
        background?: string;
        border?: SparklineCategoryAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface SparklineCategoryAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface SparklineCategoryAxisItemNotes {
        position?: string;
        icon?: SparklineCategoryAxisItemNotesIcon;
        label?: SparklineCategoryAxisItemNotesLabel;
        line?: SparklineCategoryAxisItemNotesLine;
        data?: SparklineCategoryAxisItemNotesDataItem[];
    }

    interface SparklineCategoryAxisItemPlotBand {
        from?: number;
        to?: number;
        color?: string;
        opacity?: number;
    }

    interface SparklineCategoryAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineCategoryAxisItemTitle {
        background?: string;
        border?: SparklineCategoryAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: any;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface SparklineCategoryAxisItem {
        axisCrossingValue?: any;
        categories?: any;
        color?: string;
        field?: string;
        justified?: boolean;
        labels?: SparklineCategoryAxisItemLabels;
        line?: SparklineCategoryAxisItemLine;
        majorGridLines?: SparklineCategoryAxisItemMajorGridLines;
        majorTicks?: SparklineCategoryAxisItemMajorTicks;
        minorGridLines?: SparklineCategoryAxisItemMinorGridLines;
        minorTicks?: SparklineCategoryAxisItemMinorTicks;
        name?: string;
        plotBands?: SparklineCategoryAxisItemPlotBand[];
        reverse?: boolean;
        title?: SparklineCategoryAxisItemTitle;
        type?: string;
        autoBaseUnitSteps?: any;
        baseUnit?: string;
        baseUnitStep?: any;
        max?: any;
        min?: any;
        roundToBaseUnit?: boolean;
        weekStartDay?: number;
        maxDateGroups?: number;
        visible?: boolean;
        crosshair?: SparklineCategoryAxisItemCrosshair;
        notes?: SparklineCategoryAxisItemNotes;
    }

    interface SparklineChartAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineChartArea {
        background?: string;
        opacity?: number;
        border?: SparklineChartAreaBorder;
        height?: number;
        margin?: any;
        width?: number;
    }

    interface SparklinePlotAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklinePlotArea {
        background?: string;
        opacity?: number;
        border?: SparklinePlotAreaBorder;
        margin?: any;
    }

    interface SparklineSeriesItemBorder {
        color?: any;
        dashType?: any;
        opacity?: any;
        width?: any;
    }

    interface SparklineSeriesItemConnectors {
        color?: string;
        padding?: number;
        width?: number;
    }

    interface SparklineSeriesItemHighlightBorder {
        width?: number;
        color?: string;
        opacity?: number;
    }

    interface SparklineSeriesItemHighlight {
        border?: SparklineSeriesItemHighlightBorder;
        color?: string;
        opacity?: number;
        visible?: boolean;
    }

    interface SparklineSeriesItemLabelsBorder {
        color?: any;
        dashType?: any;
        width?: any;
    }

    interface SparklineSeriesItemLabels {
        align?: string;
        background?: any;
        border?: SparklineSeriesItemLabelsBorder;
        color?: any;
        distance?: number;
        font?: any;
        format?: any;
        margin?: any;
        padding?: any;
        position?: any;
        template?: any;
        visible?: any;
    }

    interface SparklineSeriesItemLine {
        color?: string;
        opacity?: number;
        width?: string;
        style?: string;
    }

    interface SparklineSeriesItemMarkersBorder {
        color?: any;
        width?: any;
    }

    interface SparklineSeriesItemMarkers {
        background?: any;
        border?: SparklineSeriesItemMarkersBorder;
        size?: any;
        type?: any;
        visible?: any;
        rotation?: any;
    }

    interface SparklineSeriesItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface SparklineSeriesItemNotesIcon {
        background?: string;
        border?: SparklineSeriesItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface SparklineSeriesItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineSeriesItemNotesLabel {
        background?: string;
        border?: SparklineSeriesItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface SparklineSeriesItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface SparklineSeriesItemNotes {
        position?: string;
        icon?: SparklineSeriesItemNotesIcon;
        label?: SparklineSeriesItemNotesLabel;
        line?: SparklineSeriesItemNotesLine;
    }

    interface SparklineSeriesItemOverlay {
        gradient?: string;
    }

    interface SparklineSeriesItemStack {
        type?: string;
        group?: string;
    }

    interface SparklineSeriesItemTargetBorder {
        color?: any;
        dashType?: any;
        width?: number;
    }

    interface SparklineSeriesItemTargetLine {
        width?: any;
    }

    interface SparklineSeriesItemTarget {
        line?: SparklineSeriesItemTargetLine;
        color?: any;
        border?: SparklineSeriesItemTargetBorder;
    }

    interface SparklineSeriesItemTooltipBorder {
        color?: string;
        width?: number;
    }

    interface SparklineSeriesItemTooltip {
        background?: string;
        border?: SparklineSeriesItemTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface SparklineSeriesItem {
        type?: string;
        dashType?: string;
        data?: any;
        explodeField?: string;
        currentField?: string;
        targetField?: string;
        field?: string;
        name?: string;
        highlight?: SparklineSeriesItemHighlight;
        aggregate?: string;
        axis?: string;
        border?: SparklineSeriesItemBorder;
        categoryField?: string;
        color?: any;
        colorField?: string;
        connectors?: SparklineSeriesItemConnectors;
        gap?: number;
        labels?: SparklineSeriesItemLabels;
        line?: SparklineSeriesItemLine;
        markers?: SparklineSeriesItemMarkers;
        missingValues?: string;
        style?: string;
        negativeColor?: string;
        opacity?: number;
        overlay?: SparklineSeriesItemOverlay;
        padding?: number;
        size?: number;
        startAngle?: number;
        spacing?: number;
        stack?: SparklineSeriesItemStack;
        tooltip?: SparklineSeriesItemTooltip;
        width?: number;
        target?: SparklineSeriesItemTarget;
        notes?: SparklineSeriesItemNotes;
    }

    interface SparklineSeriesDefaultsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineSeriesDefaultsLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineSeriesDefaultsLabels {
        background?: string;
        border?: SparklineSeriesDefaultsLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface SparklineSeriesDefaultsStack {
        type?: string;
    }

    interface SparklineSeriesDefaultsTooltipBorder {
        color?: string;
        width?: number;
    }

    interface SparklineSeriesDefaultsTooltip {
        background?: string;
        border?: SparklineSeriesDefaultsTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface SparklineSeriesDefaults {
        area?: any;
        bar?: any;
        border?: SparklineSeriesDefaultsBorder;
        column?: any;
        gap?: number;
        labels?: SparklineSeriesDefaultsLabels;
        line?: any;
        overlay?: any;
        pie?: any;
        spacing?: number;
        stack?: SparklineSeriesDefaultsStack;
        type?: string;
        tooltip?: SparklineSeriesDefaultsTooltip;
    }

    interface SparklineTooltipBorder {
        color?: string;
        width?: number;
    }

    interface SparklineTooltip {
        background?: string;
        border?: SparklineTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
        shared?: boolean;
        sharedTemplate?: string;
    }

    interface SparklineValueAxisItemCrosshairTooltipBorder {
        color?: string;
        width?: number;
    }

    interface SparklineValueAxisItemCrosshairTooltip {
        background?: string;
        border?: SparklineValueAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface SparklineValueAxisItemCrosshair {
        color?: string;
        width?: number;
        opacity?: number;
        dashType?: number;
        visible?: boolean;
        tooltip?: SparklineValueAxisItemCrosshairTooltip;
    }

    interface SparklineValueAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineValueAxisItemLabels {
        background?: string;
        border?: SparklineValueAxisItemLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        mirror?: boolean;
        padding?: any;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface SparklineValueAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface SparklineValueAxisItemMajorGridLines {
        color?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineValueAxisItemMajorTicks {
        size?: number;
        visible?: boolean;
        color?: string;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineValueAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface SparklineValueAxisItemMinorTicks {
        size?: number;
        color?: string;
        width?: number;
        visible?: boolean;
        step?: number;
        skip?: number;
    }

    interface SparklineValueAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface SparklineValueAxisItemNotesDataItemIcon {
        background?: string;
        border?: SparklineValueAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface SparklineValueAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineValueAxisItemNotesDataItemLabel {
        background?: string;
        border?: SparklineValueAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface SparklineValueAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface SparklineValueAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: SparklineValueAxisItemNotesDataItemIcon;
        label?: SparklineValueAxisItemNotesDataItemLabel;
        line?: SparklineValueAxisItemNotesDataItemLine;
    }

    interface SparklineValueAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface SparklineValueAxisItemNotesIcon {
        background?: string;
        border?: SparklineValueAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface SparklineValueAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineValueAxisItemNotesLabel {
        background?: string;
        border?: SparklineValueAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface SparklineValueAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface SparklineValueAxisItemNotes {
        position?: string;
        icon?: SparklineValueAxisItemNotesIcon;
        label?: SparklineValueAxisItemNotesLabel;
        line?: SparklineValueAxisItemNotesLine;
        data?: SparklineValueAxisItemNotesDataItem[];
    }

    interface SparklineValueAxisItemPlotBand {
        from?: number;
        to?: number;
        color?: string;
        opacity?: number;
    }

    interface SparklineValueAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface SparklineValueAxisItemTitle {
        background?: string;
        border?: SparklineValueAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: any;
        padding?: any;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface SparklineValueAxisItem {
        axisCrossingValue?: any;
        color?: string;
        labels?: SparklineValueAxisItemLabels;
        line?: SparklineValueAxisItemLine;
        majorGridLines?: SparklineValueAxisItemMajorGridLines;
        majorTicks?: SparklineValueAxisItemMajorTicks;
        majorUnit?: number;
        max?: number;
        min?: number;
        minorGridLines?: SparklineValueAxisItemMinorGridLines;
        minorTicks?: SparklineValueAxisItemMinorTicks;
        minorUnit?: number;
        name?: any;
        narrowRange?: boolean;
        plotBands?: SparklineValueAxisItemPlotBand[];
        reverse?: boolean;
        title?: SparklineValueAxisItemTitle;
        visible?: boolean;
        crosshair?: SparklineValueAxisItemCrosshair;
        notes?: SparklineValueAxisItemNotes;
    }

    interface SparklineSeriesClickEventSeries {
        type?: any;
        name?: any;
        data?: any;
    }

    interface SparklineSeriesHoverEventSeries {
        type?: any;
        name?: any;
        data?: any;
    }

    interface SparklineOptions {
        name?: string;
        axisDefaults?: any;
        categoryAxis?: SparklineCategoryAxisItem[];
        chartArea?: SparklineChartArea;
        data?: any;
        dataSource?: any;
        autoBind?: boolean;
        plotArea?: SparklinePlotArea;
        pointWidth?: number;
        renderAs?: string;
        series?: SparklineSeriesItem[];
        seriesColors?: any;
        seriesDefaults?: SparklineSeriesDefaults;
        theme?: string;
        tooltip?: SparklineTooltip;
        transitions?: boolean;
        type?: string;
        valueAxis?: SparklineValueAxisItem[];
        axisLabelClick?(e: SparklineAxisLabelClickEvent): void;
        dataBound?(e: SparklineEvent): void;
        dragStart?(e: SparklineDragStartEvent): void;
        drag?(e: SparklineDragEvent): void;
        dragEnd?(e: SparklineDragEndEvent): void;
        plotAreaClick?(e: SparklinePlotAreaClickEvent): void;
        seriesClick?(e: SparklineSeriesClickEvent): void;
        seriesHover?(e: SparklineSeriesHoverEvent): void;
        zoomStart?(e: SparklineZoomStartEvent): void;
        zoom?(e: SparklineZoomEvent): void;
        zoomEnd?(e: SparklineZoomEndEvent): void;
    }

    interface SparklineEvent {
        sender: Sparkline;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface SparklineAxisLabelClickEvent extends SparklineEvent {
        axis?: any;
        value?: any;
        text?: any;
        index?: any;
        dataItem?: any;
        element?: any;
    }

    interface SparklineDragStartEvent extends SparklineEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface SparklineDragEvent extends SparklineEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface SparklineDragEndEvent extends SparklineEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface SparklinePlotAreaClickEvent extends SparklineEvent {
        value?: any;
        category?: any;
        element?: any;
        x?: any;
        y?: any;
    }

    interface SparklineSeriesClickEvent extends SparklineEvent {
        value?: any;
        category?: any;
        series?: SparklineSeriesClickEventSeries;
        dataItem?: any;
        element?: any;
        percentage?: any;
    }

    interface SparklineSeriesHoverEvent extends SparklineEvent {
        value?: any;
        category?: any;
        series?: SparklineSeriesHoverEventSeries;
        dataItem?: any;
        element?: any;
        percentage?: any;
    }

    interface SparklineZoomStartEvent extends SparklineEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface SparklineZoomEvent extends SparklineEvent {
        axisRanges?: any;
        delta?: number;
        originalEvent?: any;
    }

    interface SparklineZoomEndEvent extends SparklineEvent {
        axisRanges?: any;
        originalEvent?: any;
    }


    class StockChart extends kendo.ui.Widget {
        static fn: StockChart;
        static extend(proto: Object): StockChart;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: StockChartOptions);
        options: StockChartOptions;
        dataSource: kendo.data.DataSource;
        destroy(): void;
        redraw(): void;
        refresh(): void;
        resize(force?: boolean): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        svg(): string;
        imageDataURL(): string;
    }

    interface StockChartCategoryAxisItemAutoBaseUnitSteps {
        days?: any;
        hours?: any;
        minutes?: any;
        months?: any;
        weeks?: any;
        years?: any;
    }

    interface StockChartCategoryAxisItemCrosshairTooltipBorder {
        color?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemCrosshairTooltip {
        background?: string;
        border?: StockChartCategoryAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface StockChartCategoryAxisItemCrosshair {
        color?: string;
        width?: number;
        opacity?: number;
        dashType?: number;
        visible?: boolean;
        tooltip?: StockChartCategoryAxisItemCrosshairTooltip;
    }

    interface StockChartCategoryAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemLabels {
        background?: string;
        border?: StockChartCategoryAxisItemLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        mirror?: boolean;
        padding?: any;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
        culture?: string;
        dateFormats?: any;
    }

    interface StockChartCategoryAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface StockChartCategoryAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartCategoryAxisItemMajorTicks {
        color?: string;
        size?: number;
        width?: number;
        visible?: boolean;
        step?: number;
        skip?: number;
    }

    interface StockChartCategoryAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartCategoryAxisItemMinorTicks {
        size?: number;
        visible?: boolean;
        color?: string;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartCategoryAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemNotesDataItemIcon {
        background?: string;
        border?: StockChartCategoryAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartCategoryAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemNotesDataItemLabel {
        background?: string;
        border?: StockChartCategoryAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface StockChartCategoryAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartCategoryAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: StockChartCategoryAxisItemNotesDataItemIcon;
        label?: StockChartCategoryAxisItemNotesDataItemLabel;
        line?: StockChartCategoryAxisItemNotesDataItemLine;
    }

    interface StockChartCategoryAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemNotesIcon {
        background?: string;
        border?: StockChartCategoryAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartCategoryAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemNotesLabel {
        background?: string;
        border?: StockChartCategoryAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface StockChartCategoryAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartCategoryAxisItemNotes {
        position?: string;
        icon?: StockChartCategoryAxisItemNotesIcon;
        label?: StockChartCategoryAxisItemNotesLabel;
        line?: StockChartCategoryAxisItemNotesLine;
        data?: StockChartCategoryAxisItemNotesDataItem[];
    }

    interface StockChartCategoryAxisItemPlotBand {
        from?: number;
        to?: number;
        color?: string;
        opacity?: number;
    }

    interface StockChartCategoryAxisItemSelectMousewheel {
        reverse?: boolean;
        zoom?: string;
    }

    interface StockChartCategoryAxisItemSelect {
        from?: any;
        to?: any;
        min?: any;
        max?: any;
        mousewheel?: StockChartCategoryAxisItemSelectMousewheel;
    }

    interface StockChartCategoryAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartCategoryAxisItemTitle {
        background?: string;
        border?: StockChartCategoryAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: any;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface StockChartCategoryAxisItem {
        axisCrossingValue?: any;
        categories?: any;
        color?: string;
        field?: string;
        justified?: boolean;
        labels?: StockChartCategoryAxisItemLabels;
        line?: StockChartCategoryAxisItemLine;
        majorGridLines?: StockChartCategoryAxisItemMajorGridLines;
        majorTicks?: StockChartCategoryAxisItemMajorTicks;
        minorGridLines?: StockChartCategoryAxisItemMinorGridLines;
        minorTicks?: StockChartCategoryAxisItemMinorTicks;
        name?: string;
        pane?: string;
        plotBands?: StockChartCategoryAxisItemPlotBand[];
        reverse?: boolean;
        select?: StockChartCategoryAxisItemSelect;
        title?: StockChartCategoryAxisItemTitle;
        type?: string;
        autoBaseUnitSteps?: StockChartCategoryAxisItemAutoBaseUnitSteps;
        background?: string;
        baseUnit?: string;
        baseUnitStep?: any;
        max?: any;
        min?: any;
        roundToBaseUnit?: boolean;
        weekStartDay?: number;
        maxDateGroups?: number;
        visible?: boolean;
        crosshair?: StockChartCategoryAxisItemCrosshair;
        notes?: StockChartCategoryAxisItemNotes;
    }

    interface StockChartChartAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartChartArea {
        background?: string;
        opacity?: number;
        border?: StockChartChartAreaBorder;
        height?: number;
        margin?: any;
        width?: number;
    }

    interface StockChartLegendBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartLegendInactiveItemsLabels {
        color?: string;
        font?: string;
        template?: string;
    }

    interface StockChartLegendInactiveItemsMarkers {
        color?: string;
    }

    interface StockChartLegendInactiveItems {
        labels?: StockChartLegendInactiveItemsLabels;
        markers?: StockChartLegendInactiveItemsMarkers;
    }

    interface StockChartLegendLabels {
        color?: string;
        font?: string;
        template?: string;
    }

    interface StockChartLegend {
        background?: string;
        border?: StockChartLegendBorder;
        labels?: StockChartLegendLabels;
        margin?: any;
        offsetX?: number;
        offsetY?: number;
        padding?: any;
        position?: string;
        visible?: boolean;
        inactiveItems?: StockChartLegendInactiveItems;
    }

    interface StockChartNavigatorCategoryAxisItemAutoBaseUnitSteps {
        seconds?: any;
        minutes?: any;
        hours?: any;
        days?: any;
        weeks?: any;
        months?: any;
        years?: any;
    }

    interface StockChartNavigatorCategoryAxisItemCrosshairTooltipBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemCrosshairTooltipPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorCategoryAxisItemCrosshairTooltip {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: StockChartNavigatorCategoryAxisItemCrosshairTooltipPadding;
        template?: any;
        visible?: boolean;
    }

    interface StockChartNavigatorCategoryAxisItemCrosshair {
        color?: string;
        opacity?: number;
        tooltip?: StockChartNavigatorCategoryAxisItemCrosshairTooltip;
        visible?: boolean;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemLabelsDateFormats {
        days?: string;
        hours?: string;
        months?: string;
        weeks?: string;
        years?: string;
    }

    interface StockChartNavigatorCategoryAxisItemLabelsMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorCategoryAxisItemLabelsPadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorCategoryAxisItemLabels {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemLabelsBorder;
        color?: string;
        culture?: string;
        dateFormats?: StockChartNavigatorCategoryAxisItemLabelsDateFormats;
        font?: string;
        format?: string;
        margin?: StockChartNavigatorCategoryAxisItemLabelsMargin;
        mirror?: boolean;
        padding?: StockChartNavigatorCategoryAxisItemLabelsPadding;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface StockChartNavigatorCategoryAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemMajorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartNavigatorCategoryAxisItemMajorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartNavigatorCategoryAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartNavigatorCategoryAxisItemMinorTicks {
        color?: string;
        size?: number;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotesDataItemIcon {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartNavigatorCategoryAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotesDataItemLabel {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface StockChartNavigatorCategoryAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: StockChartNavigatorCategoryAxisItemNotesDataItemIcon;
        label?: StockChartNavigatorCategoryAxisItemNotesDataItemLabel;
        line?: StockChartNavigatorCategoryAxisItemNotesDataItemLine;
    }

    interface StockChartNavigatorCategoryAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotesIcon {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartNavigatorCategoryAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotesLabel {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface StockChartNavigatorCategoryAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartNavigatorCategoryAxisItemNotes {
        position?: string;
        icon?: StockChartNavigatorCategoryAxisItemNotesIcon;
        label?: StockChartNavigatorCategoryAxisItemNotesLabel;
        line?: StockChartNavigatorCategoryAxisItemNotesLine;
        data?: StockChartNavigatorCategoryAxisItemNotesDataItem[];
    }

    interface StockChartNavigatorCategoryAxisItemPlotBand {
        color?: string;
        from?: number;
        opacity?: number;
        to?: number;
    }

    interface StockChartNavigatorCategoryAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorCategoryAxisItemTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorCategoryAxisItemTitlePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorCategoryAxisItemTitle {
        background?: string;
        border?: StockChartNavigatorCategoryAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: StockChartNavigatorCategoryAxisItemTitleMargin;
        padding?: StockChartNavigatorCategoryAxisItemTitlePadding;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface StockChartNavigatorCategoryAxisItem {
        autoBaseUnitSteps?: StockChartNavigatorCategoryAxisItemAutoBaseUnitSteps;
        axisCrossingValue?: any;
        background?: string;
        baseUnit?: string;
        baseUnitStep?: any;
        categories?: any;
        color?: string;
        crosshair?: StockChartNavigatorCategoryAxisItemCrosshair;
        field?: string;
        justified?: boolean;
        labels?: StockChartNavigatorCategoryAxisItemLabels;
        line?: StockChartNavigatorCategoryAxisItemLine;
        majorGridLines?: StockChartNavigatorCategoryAxisItemMajorGridLines;
        majorTicks?: StockChartNavigatorCategoryAxisItemMajorTicks;
        max?: any;
        maxDateGroups?: number;
        min?: any;
        minorGridLines?: StockChartNavigatorCategoryAxisItemMinorGridLines;
        minorTicks?: StockChartNavigatorCategoryAxisItemMinorTicks;
        plotBands?: StockChartNavigatorCategoryAxisItemPlotBand[];
        reverse?: boolean;
        roundToBaseUnit?: boolean;
        title?: StockChartNavigatorCategoryAxisItemTitle;
        visible?: boolean;
        weekStartDay?: number;
        notes?: StockChartNavigatorCategoryAxisItemNotes;
    }

    interface StockChartNavigatorHint {
        visible?: boolean;
        template?: any;
        format?: string;
    }

    interface StockChartNavigatorPaneBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorPaneMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorPanePadding {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorPaneTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorPaneTitleMargin {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    }

    interface StockChartNavigatorPaneTitle {
        background?: string;
        border?: StockChartNavigatorPaneTitleBorder;
        color?: string;
        font?: string;
        margin?: StockChartNavigatorPaneTitleMargin;
        position?: string;
        text?: string;
        visible?: boolean;
    }

    interface StockChartNavigatorPane {
        background?: string;
        border?: StockChartNavigatorPaneBorder;
        height?: number;
        margin?: StockChartNavigatorPaneMargin;
        name?: string;
        padding?: StockChartNavigatorPanePadding;
        title?: StockChartNavigatorPaneTitle;
    }

    interface StockChartNavigatorSelect {
        from?: Date;
        to?: Date;
    }

    interface StockChartNavigatorSeriesItemBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorSeriesItemHighlightBorder {
        width?: number;
        color?: string;
        opacity?: number;
    }

    interface StockChartNavigatorSeriesItemHighlightLine {
        width?: number;
        color?: string;
        opacity?: number;
    }

    interface StockChartNavigatorSeriesItemHighlight {
        border?: StockChartNavigatorSeriesItemHighlightBorder;
        color?: string;
        line?: StockChartNavigatorSeriesItemHighlightLine;
        opacity?: number;
        visible?: boolean;
    }

    interface StockChartNavigatorSeriesItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartNavigatorSeriesItemLabels {
        background?: string;
        border?: StockChartNavigatorSeriesItemLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        padding?: any;
        position?: string;
        template?: any;
        visible?: boolean;
    }

    interface StockChartNavigatorSeriesItemLine {
        color?: string;
        opacity?: number;
        width?: string;
    }

    interface StockChartNavigatorSeriesItemMarkersBorder {
        color?: string;
        width?: number;
    }

    interface StockChartNavigatorSeriesItemMarkers {
        background?: string;
        border?: StockChartNavigatorSeriesItemMarkersBorder;
        rotation?: any;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartNavigatorSeriesItemOverlay {
        gradient?: string;
    }

    interface StockChartNavigatorSeriesItemStack {
        type?: string;
        group?: string;
    }

    interface StockChartNavigatorSeriesItemTooltipBorder {
        color?: string;
        width?: number;
    }

    interface StockChartNavigatorSeriesItemTooltip {
        background?: string;
        border?: StockChartNavigatorSeriesItemTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface StockChartNavigatorSeriesItem {
        type?: string;
        dashType?: string;
        data?: any;
        highField?: string;
        field?: string;
        categoryField?: string;
        name?: string;
        highlight?: StockChartNavigatorSeriesItemHighlight;
        aggregate?: string;
        axis?: string;
        border?: StockChartNavigatorSeriesItemBorder;
        closeField?: string;
        color?: string;
        colorField?: string;
        downColor?: string;
        downColorField?: string;
        gap?: number;
        labels?: StockChartNavigatorSeriesItemLabels;
        line?: StockChartNavigatorSeriesItemLine;
        lowField?: string;
        markers?: StockChartNavigatorSeriesItemMarkers;
        missingValues?: string;
        style?: string;
        opacity?: number;
        openField?: string;
        overlay?: StockChartNavigatorSeriesItemOverlay;
        spacing?: number;
        stack?: StockChartNavigatorSeriesItemStack;
        tooltip?: StockChartNavigatorSeriesItemTooltip;
        width?: number;
    }

    interface StockChartNavigator {
        categoryAxis?: StockChartNavigatorCategoryAxisItem[];
        dataSource?: any;
        autoBind?: boolean;
        dateField?: string;
        pane?: StockChartNavigatorPane;
        visible?: boolean;
        series?: StockChartNavigatorSeriesItem[];
        select?: StockChartNavigatorSelect;
        hint?: StockChartNavigatorHint;
    }

    interface StockChartPaneBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartPaneTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartPaneTitle {
        background?: string;
        border?: StockChartPaneTitleBorder;
        color?: string;
        font?: string;
        margin?: any;
        position?: string;
        text?: string;
        visible?: boolean;
    }

    interface StockChartPane {
        name?: string;
        margin?: any;
        padding?: any;
        background?: string;
        border?: StockChartPaneBorder;
        clip?: boolean;
        height?: number;
        title?: StockChartPaneTitle;
    }

    interface StockChartPlotAreaBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartPlotArea {
        background?: string;
        opacity?: number;
        border?: StockChartPlotAreaBorder;
        margin?: any;
    }

    interface StockChartSeriesItemBorder {
        color?: any;
        dashType?: any;
        opacity?: any;
        width?: any;
    }

    interface StockChartSeriesItemHighlightBorder {
        width?: number;
        color?: string;
        opacity?: number;
    }

    interface StockChartSeriesItemHighlightLine {
        width?: number;
        color?: string;
        opacity?: number;
    }

    interface StockChartSeriesItemHighlight {
        visible?: boolean;
        border?: StockChartSeriesItemHighlightBorder;
        color?: string;
        line?: StockChartSeriesItemHighlightLine;
        opacity?: number;
    }

    interface StockChartSeriesItemLabelsBorder {
        color?: any;
        dashType?: any;
        width?: any;
    }

    interface StockChartSeriesItemLabels {
        background?: any;
        border?: StockChartSeriesItemLabelsBorder;
        color?: any;
        font?: any;
        format?: any;
        margin?: any;
        padding?: any;
        position?: any;
        template?: any;
        visible?: any;
    }

    interface StockChartSeriesItemLine {
        color?: string;
        opacity?: number;
        width?: string;
        style?: string;
    }

    interface StockChartSeriesItemMarkersBorder {
        color?: any;
        width?: any;
    }

    interface StockChartSeriesItemMarkers {
        background?: any;
        border?: StockChartSeriesItemMarkersBorder;
        size?: any;
        rotation?: any;
        type?: any;
        visible?: any;
    }

    interface StockChartSeriesItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartSeriesItemNotesIcon {
        background?: string;
        border?: StockChartSeriesItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartSeriesItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartSeriesItemNotesLabel {
        background?: string;
        border?: StockChartSeriesItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface StockChartSeriesItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartSeriesItemNotes {
        position?: string;
        icon?: StockChartSeriesItemNotesIcon;
        label?: StockChartSeriesItemNotesLabel;
        line?: StockChartSeriesItemNotesLine;
    }

    interface StockChartSeriesItemOverlay {
        gradient?: string;
    }

    interface StockChartSeriesItemStack {
        type?: string;
        group?: string;
    }

    interface StockChartSeriesItemTargetBorder {
        color?: any;
        dashType?: any;
        width?: any;
    }

    interface StockChartSeriesItemTargetLine {
        width?: any;
    }

    interface StockChartSeriesItemTarget {
        line?: StockChartSeriesItemTargetLine;
        color?: any;
        border?: StockChartSeriesItemTargetBorder;
    }

    interface StockChartSeriesItemTooltipBorder {
        color?: string;
        width?: number;
    }

    interface StockChartSeriesItemTooltip {
        background?: string;
        border?: StockChartSeriesItemTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface StockChartSeriesItem {
        type?: string;
        dashType?: string;
        data?: any;
        highField?: string;
        field?: string;
        categoryField?: string;
        currentField?: string;
        targetField?: string;
        name?: string;
        highlight?: StockChartSeriesItemHighlight;
        aggregate?: string;
        axis?: string;
        border?: StockChartSeriesItemBorder;
        closeField?: string;
        color?: any;
        colorField?: string;
        downColor?: any;
        downColorField?: string;
        gap?: number;
        labels?: StockChartSeriesItemLabels;
        line?: StockChartSeriesItemLine;
        lowField?: string;
        markers?: StockChartSeriesItemMarkers;
        missingValues?: string;
        style?: string;
        negativeColor?: string;
        opacity?: number;
        openField?: string;
        overlay?: StockChartSeriesItemOverlay;
        spacing?: number;
        stack?: StockChartSeriesItemStack;
        tooltip?: StockChartSeriesItemTooltip;
        visibleInLegend?: boolean;
        width?: number;
        target?: StockChartSeriesItemTarget;
        notes?: StockChartSeriesItemNotes;
    }

    interface StockChartSeriesDefaultsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartSeriesDefaultsLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartSeriesDefaultsLabels {
        background?: string;
        border?: StockChartSeriesDefaultsLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface StockChartSeriesDefaultsStack {
        type?: string;
    }

    interface StockChartSeriesDefaultsTooltipBorder {
        color?: string;
        width?: number;
    }

    interface StockChartSeriesDefaultsTooltip {
        background?: string;
        border?: StockChartSeriesDefaultsTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface StockChartSeriesDefaults {
        area?: any;
        candlestick?: any;
        ohlc?: any;
        border?: StockChartSeriesDefaultsBorder;
        column?: any;
        gap?: number;
        labels?: StockChartSeriesDefaultsLabels;
        line?: any;
        overlay?: any;
        pie?: any;
        spacing?: number;
        stack?: StockChartSeriesDefaultsStack;
        type?: string;
        tooltip?: StockChartSeriesDefaultsTooltip;
    }

    interface StockChartTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartTitle {
        align?: string;
        background?: string;
        border?: StockChartTitleBorder;
        font?: string;
        margin?: any;
        padding?: any;
        position?: string;
        text?: string;
        visible?: boolean;
    }

    interface StockChartTooltipBorder {
        color?: string;
        width?: number;
    }

    interface StockChartTooltip {
        background?: string;
        border?: StockChartTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
        shared?: boolean;
        sharedTemplate?: string;
    }

    interface StockChartValueAxisItemCrosshairTooltipBorder {
        color?: string;
        width?: number;
    }

    interface StockChartValueAxisItemCrosshairTooltip {
        background?: string;
        border?: StockChartValueAxisItemCrosshairTooltipBorder;
        color?: string;
        font?: string;
        format?: string;
        padding?: any;
        template?: any;
        visible?: boolean;
    }

    interface StockChartValueAxisItemCrosshair {
        color?: string;
        width?: number;
        opacity?: number;
        dashType?: number;
        visible?: boolean;
        tooltip?: StockChartValueAxisItemCrosshairTooltip;
    }

    interface StockChartValueAxisItemLabelsBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartValueAxisItemLabels {
        background?: string;
        border?: StockChartValueAxisItemLabelsBorder;
        color?: string;
        font?: string;
        format?: string;
        margin?: any;
        mirror?: boolean;
        padding?: any;
        rotation?: number;
        skip?: number;
        step?: number;
        template?: any;
        visible?: boolean;
    }

    interface StockChartValueAxisItemLine {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
    }

    interface StockChartValueAxisItemMajorGridLines {
        color?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartValueAxisItemMajorTicks {
        size?: number;
        visible?: boolean;
        color?: string;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartValueAxisItemMinorGridLines {
        color?: string;
        dashType?: string;
        visible?: boolean;
        width?: number;
        step?: number;
        skip?: number;
    }

    interface StockChartValueAxisItemMinorTicks {
        size?: number;
        color?: string;
        width?: number;
        visible?: boolean;
        step?: number;
        skip?: number;
    }

    interface StockChartValueAxisItemNotesDataItemIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartValueAxisItemNotesDataItemIcon {
        background?: string;
        border?: StockChartValueAxisItemNotesDataItemIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartValueAxisItemNotesDataItemLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartValueAxisItemNotesDataItemLabel {
        background?: string;
        border?: StockChartValueAxisItemNotesDataItemLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        text?: string;
        position?: string;
    }

    interface StockChartValueAxisItemNotesDataItemLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartValueAxisItemNotesDataItem {
        value?: any;
        position?: string;
        icon?: StockChartValueAxisItemNotesDataItemIcon;
        label?: StockChartValueAxisItemNotesDataItemLabel;
        line?: StockChartValueAxisItemNotesDataItemLine;
    }

    interface StockChartValueAxisItemNotesIconBorder {
        color?: string;
        width?: number;
    }

    interface StockChartValueAxisItemNotesIcon {
        background?: string;
        border?: StockChartValueAxisItemNotesIconBorder;
        size?: number;
        type?: string;
        visible?: boolean;
    }

    interface StockChartValueAxisItemNotesLabelBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartValueAxisItemNotesLabel {
        background?: string;
        border?: StockChartValueAxisItemNotesLabelBorder;
        color?: string;
        font?: string;
        template?: any;
        visible?: boolean;
        rotation?: number;
        format?: string;
        position?: string;
    }

    interface StockChartValueAxisItemNotesLine {
        width?: number;
        color?: string;
        length?: number;
    }

    interface StockChartValueAxisItemNotes {
        position?: string;
        icon?: StockChartValueAxisItemNotesIcon;
        label?: StockChartValueAxisItemNotesLabel;
        line?: StockChartValueAxisItemNotesLine;
        data?: StockChartValueAxisItemNotesDataItem[];
    }

    interface StockChartValueAxisItemPlotBand {
        from?: number;
        to?: number;
        color?: string;
        opacity?: number;
    }

    interface StockChartValueAxisItemTitleBorder {
        color?: string;
        dashType?: string;
        width?: number;
    }

    interface StockChartValueAxisItemTitle {
        background?: string;
        border?: StockChartValueAxisItemTitleBorder;
        color?: string;
        font?: string;
        margin?: any;
        padding?: any;
        position?: string;
        rotation?: number;
        text?: string;
        visible?: boolean;
    }

    interface StockChartValueAxisItem {
        axisCrossingValue?: any;
        background?: string;
        color?: string;
        labels?: StockChartValueAxisItemLabels;
        line?: StockChartValueAxisItemLine;
        majorGridLines?: StockChartValueAxisItemMajorGridLines;
        majorTicks?: StockChartValueAxisItemMajorTicks;
        majorUnit?: number;
        max?: number;
        min?: number;
        minorGridLines?: StockChartValueAxisItemMinorGridLines;
        minorTicks?: StockChartValueAxisItemMinorTicks;
        minorUnit?: number;
        name?: any;
        narrowRange?: boolean;
        pane?: string;
        plotBands?: StockChartValueAxisItemPlotBand[];
        reverse?: boolean;
        title?: StockChartValueAxisItemTitle;
        visible?: boolean;
        crosshair?: StockChartValueAxisItemCrosshair;
        notes?: StockChartValueAxisItemNotes;
    }

    interface StockChartSeriesClickEventSeries {
        type?: any;
        name?: any;
        data?: any;
    }

    interface StockChartSeriesHoverEventSeries {
        type?: any;
        name?: any;
        data?: any;
    }

    interface StockChartOptions {
        name?: string;
        dateField?: string;
        navigator?: StockChartNavigator;
        axisDefaults?: any;
        categoryAxis?: StockChartCategoryAxisItem[];
        chartArea?: StockChartChartArea;
        dataSource?: any;
        autoBind?: boolean;
        legend?: StockChartLegend;
        panes?: StockChartPane[];
        plotArea?: StockChartPlotArea;
        renderAs?: string;
        series?: StockChartSeriesItem[];
        seriesColors?: any;
        seriesDefaults?: StockChartSeriesDefaults;
        theme?: string;
        title?: StockChartTitle;
        tooltip?: StockChartTooltip;
        transitions?: boolean;
        valueAxis?: StockChartValueAxisItem[];
        axisLabelClick?(e: StockChartAxisLabelClickEvent): void;
        legendItemClick?(e: StockChartLegendItemClickEvent): void;
        legendItemHover?(e: StockChartLegendItemHoverEvent): void;
        dataBound?(e: StockChartEvent): void;
        dragStart?(e: StockChartDragStartEvent): void;
        drag?(e: StockChartDragEvent): void;
        dragEnd?(e: StockChartDragEndEvent): void;
        noteClick?(e: StockChartNoteClickEvent): void;
        noteHover?(e: StockChartNoteHoverEvent): void;
        plotAreaClick?(e: StockChartPlotAreaClickEvent): void;
        seriesClick?(e: StockChartSeriesClickEvent): void;
        seriesHover?(e: StockChartSeriesHoverEvent): void;
        zoomStart?(e: StockChartZoomStartEvent): void;
        zoom?(e: StockChartZoomEvent): void;
        zoomEnd?(e: StockChartZoomEndEvent): void;
        selectStart?(e: StockChartSelectStartEvent): void;
        select?(e: StockChartSelectEvent): void;
        selectEnd?(e: StockChartSelectEndEvent): void;
    }

    interface StockChartEvent {
        sender: StockChart;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface StockChartAxisLabelClickEvent extends StockChartEvent {
        axis?: any;
        value?: any;
        text?: any;
        index?: any;
        dataItem?: any;
        element?: any;
    }

    interface StockChartLegendItemClickEvent extends StockChartEvent {
        text?: string;
        series?: any;
        seriesIndex?: number;
        pointIndex?: number;
        element?: any;
    }

    interface StockChartLegendItemHoverEvent extends StockChartEvent {
        text?: string;
        series?: any;
        seriesIndex?: number;
        pointIndex?: number;
        element?: any;
    }

    interface StockChartDragStartEvent extends StockChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface StockChartDragEvent extends StockChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface StockChartDragEndEvent extends StockChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface StockChartNoteClickEvent extends StockChartEvent {
        category?: any;
        element?: any;
        value?: any;
        series?: any;
        dataItem?: any;
    }

    interface StockChartNoteHoverEvent extends StockChartEvent {
        category?: any;
        element?: any;
        value?: any;
        series?: any;
        dataItem?: any;
    }

    interface StockChartPlotAreaClickEvent extends StockChartEvent {
        value?: any;
        category?: any;
        element?: any;
        x?: any;
        y?: any;
    }

    interface StockChartSeriesClickEvent extends StockChartEvent {
        value?: any;
        category?: any;
        series?: StockChartSeriesClickEventSeries;
        dataItem?: any;
        element?: any;
        percentage?: any;
    }

    interface StockChartSeriesHoverEvent extends StockChartEvent {
        value?: any;
        category?: any;
        series?: StockChartSeriesHoverEventSeries;
        dataItem?: any;
        element?: any;
        percentage?: any;
    }

    interface StockChartZoomStartEvent extends StockChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface StockChartZoomEvent extends StockChartEvent {
        axisRanges?: any;
        delta?: number;
        originalEvent?: any;
    }

    interface StockChartZoomEndEvent extends StockChartEvent {
        axisRanges?: any;
        originalEvent?: any;
    }

    interface StockChartSelectStartEvent extends StockChartEvent {
        axis?: any;
        from?: any;
        to?: any;
    }

    interface StockChartSelectEvent extends StockChartEvent {
        axis?: any;
        from?: any;
        to?: any;
    }

    interface StockChartSelectEndEvent extends StockChartEvent {
        axis?: any;
        from?: any;
        to?: any;
    }


    class TreeMap extends kendo.ui.Widget {
        static fn: TreeMap;
        static extend(proto: Object): TreeMap;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: TreeMapOptions);
        options: TreeMapOptions;
        dataSource: kendo.data.DataSource;
    }

    interface TreeMapOptions {
        name?: string;
        dataSource?: any;
        autoBind?: boolean;
        valueField?: string;
        colorField?: string;
        textField?: string;
        template?: any;
        colors?: any;
        itemCreated?(e: TreeMapItemCreatedEvent): void;
        dataBound?(e: TreeMapDataBoundEvent): void;
    }

    interface TreeMapEvent {
        sender: TreeMap;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface TreeMapItemCreatedEvent extends TreeMapEvent {
        element?: any;
    }

    interface TreeMapDataBoundEvent extends TreeMapEvent {
    }


}
declare module kendo.dataviz.diagram {
    class Circle extends Observable {
        constructor(options?: CircleOptions);
        options: CircleOptions;
        visible(): boolean;
        visible(visible: boolean): void;
    }

    interface CircleFill {
        color?: string;
        opacity?: number;
    }

    interface CircleStroke {
        color?: string;
        width?: number;
    }

    interface CircleOptions {
        name?: string;
        fill?: CircleFill;
        stroke?: CircleStroke;
        center?: any;
        radius?: number;
    }

    interface CircleEvent {
        sender: Circle;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Connection extends Observable {
        constructor(options?: ConnectionOptions);
        options: ConnectionOptions;
        source(): any;
        source(source: kendo.dataviz.diagram.Shape): void;
        source(source: kendo.dataviz.diagram.Point): void;
        source(source: kendo.dataviz.diagram.Connector): void;
        sourcePoint(): kendo.dataviz.diagram.Point;
        target(): any;
        target(target: kendo.dataviz.diagram.Shape): void;
        target(target: kendo.dataviz.diagram.Point): void;
        target(target: kendo.dataviz.diagram.Connector): void;
        targetPoint(): kendo.dataviz.diagram.Point;
        select(value: boolean): void;
        type(): void;
        type(value: string): void;
        points(): any;
        allPoints(): any;
        redraw(): void;
    }

    interface ConnectionHoverStroke {
        color?: string;
    }

    interface ConnectionHover {
        stroke?: ConnectionHoverStroke;
    }

    interface ConnectionPoint {
        x?: number;
        y?: number;
    }

    interface ConnectionStroke {
        color?: string;
    }

    interface ConnectionOptions {
        name?: string;
        stroke?: ConnectionStroke;
        hover?: ConnectionHover;
        startCap?: string;
        endCap?: string;
        points?: ConnectionPoint[];
    }

    interface ConnectionEvent {
        sender: Connection;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Connector extends Observable {
        constructor(options?: ConnectorOptions);
        options: ConnectorOptions;
        position(): kendo.dataviz.diagram.Point;
        position(position: kendo.dataviz.diagram.Point): void;
    }

    interface ConnectorFill {
        color?: string;
        opacity?: number;
    }

    interface ConnectorOptions {
        name?: string;
        width?: number;
        height?: number;
        fill?: ConnectorFill;
    }

    interface ConnectorEvent {
        sender: Connector;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Group extends Observable {
        constructor(options?: GroupOptions);
        options: GroupOptions;
        append(element: any): void;
        clear(): void;
        remove(element: any): void;
        visible(): boolean;
        visible(visible: boolean): void;
    }

    interface GroupOptions {
        name?: string;
        x?: number;
        y?: number;
    }

    interface GroupEvent {
        sender: Group;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Image extends Observable {
        constructor(options?: ImageOptions);
        options: ImageOptions;
        visible(): boolean;
        visible(visible: boolean): void;
    }

    interface ImageOptions {
        name?: string;
        height?: number;
        width?: number;
        x?: number;
        y?: number;
        source?: string;
    }

    interface ImageEvent {
        sender: Image;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Line extends Observable {
        constructor(options?: LineOptions);
        options: LineOptions;
        visible(): boolean;
        visible(visible: boolean): void;
    }

    interface LineStroke {
        color?: string;
        width?: number;
    }

    interface LineOptions {
        name?: string;
        stroke?: LineStroke;
        from?: any;
        to?: any;
    }

    interface LineEvent {
        sender: Line;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Point extends Observable {
        constructor(options?: PointOptions);
        options: PointOptions;
    }

    interface PointOptions {
        name?: string;
        x?: number;
    }

    interface PointEvent {
        sender: Point;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Rect extends Observable {
        constructor(options?: RectOptions);
        options: RectOptions;
    }

    interface RectOptions {
        name?: string;
        height?: number;
        width?: number;
        x?: number;
        y?: number;
    }

    interface RectEvent {
        sender: Rect;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Rectangle extends Observable {
        constructor(options?: RectangleOptions);
        options: RectangleOptions;
        visible(): boolean;
        visible(visible: boolean): void;
    }

    interface RectangleFill {
        color?: string;
        opacity?: number;
    }

    interface RectangleStroke {
        color?: string;
        width?: number;
    }

    interface RectangleOptions {
        name?: string;
        fill?: RectangleFill;
        height?: number;
        stroke?: RectangleStroke;
        width?: number;
        x?: number;
        y?: number;
    }

    interface RectangleEvent {
        sender: Rectangle;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Shape extends Observable {
        constructor(options?: ShapeOptions);
        options: ShapeOptions;
        position(): void;
        position(point: kendo.dataviz.diagram.Point): void;
        clone(): kendo.dataviz.diagram.Shape;
        select(value: boolean): void;
        connections(type: string): void;
        getConnector(): void;
        getPosition(side: string): void;
        redraw(): void;
    }

    interface ShapeConnector {
        name?: string;
        description?: string;
        position?: Function;
    }

    interface ShapeContent {
        text?: string;
        align?: string;
    }

    interface ShapeFill {
        color?: string;
        opacity?: number;
    }

    interface ShapeHoverFill {
        color?: string;
        opacity?: number;
    }

    interface ShapeHover {
        fill?: ShapeHoverFill;
    }

    interface ShapeRotation {
        angle?: number;
    }

    interface ShapeStroke {
        color?: string;
        width?: number;
        dashType?: string;
    }

    interface ShapeOptions {
        name?: string;
        id?: string;
        path?: string;
        stroke?: ShapeStroke;
        type?: string;
        x?: number;
        y?: number;
        minWidth?: number;
        minHeight?: number;
        width?: number;
        height?: number;
        fill?: ShapeFill;
        hover?: ShapeHover;
        connectors?: ShapeConnector[];
        rotation?: ShapeRotation;
        content?: ShapeContent;
        visual?: Function;
    }

    interface ShapeEvent {
        sender: Shape;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class TextBlock extends Observable {
        constructor(options?: TextBlockOptions);
        options: TextBlockOptions;
        content(): string;
        content(content: string): void;
        visible(): boolean;
        visible(visible: boolean): void;
    }

    interface TextBlockOptions {
        name?: string;
        color?: string;
        fontFamily?: string;
        fontSize?: number;
        height?: number;
        text?: string;
        width?: number;
        x?: number;
        y?: number;
    }

    interface TextBlockEvent {
        sender: TextBlock;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


}
declare module kendo {
    class Color extends Observable {
        options: ColorOptions;
        diff(): number;
        equals(): boolean;
    }

    interface ColorOptions {
        name?: string;
    }

    interface ColorEvent {
        sender: Color;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


}
declare module kendo.dataviz.drawing {
    class Element extends Observable {
        options: ElementOptions;
    }

    interface ElementOptions {
        name?: string;
    }

    interface ElementEvent {
        sender: Element;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Surface extends Observable {
        constructor(options?: SurfaceOptions);
        options: SurfaceOptions;
    }

    interface SurfaceOptions {
        name?: string;
        type?: string;
        height?: string;
        width?: string;
        click?(e: SurfaceClickEvent): void;
        mouseenter?(e: SurfaceMouseenterEvent): void;
        mouseleave?(e: SurfaceMouseleaveEvent): void;
    }

    interface SurfaceEvent {
        sender: Surface;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface SurfaceClickEvent extends SurfaceEvent {
        element?: kendo.dataviz.drawing.Element;
        originalEvent?: any;
    }

    interface SurfaceMouseenterEvent extends SurfaceEvent {
        element?: kendo.dataviz.drawing.Element;
        originalEvent?: any;
    }

    interface SurfaceMouseleaveEvent extends SurfaceEvent {
        element?: kendo.dataviz.drawing.Element;
        originalEvent?: any;
    }


}
declare module kendo.mobile.ui {
    class ActionSheet extends kendo.mobile.ui.Widget {
        static fn: ActionSheet;
        static extend(proto: Object): ActionSheet;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ActionSheetOptions);
        options: ActionSheetOptions;
        close(): void;
        destroy(): void;
        open(target: JQuery, context: any): void;
    }

    interface ActionSheetPopup {
        direction?: any;
        height?: any;
        width?: any;
    }

    interface ActionSheetOptions {
        name?: string;
        cancel?: string;
        popup?: ActionSheetPopup;
        type?: string;
        close?(e: ActionSheetEvent): void;
        open?(e: ActionSheetOpenEvent): void;
    }

    interface ActionSheetEvent {
        sender: ActionSheet;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ActionSheetOpenEvent extends ActionSheetEvent {
        target?: JQuery;
        context?: JQuery;
    }


    class BackButton extends kendo.mobile.ui.Widget {
        static fn: BackButton;
        static extend(proto: Object): BackButton;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: BackButtonOptions);
        options: BackButtonOptions;
        destroy(): void;
    }

    interface BackButtonOptions {
        name?: string;
        click?(e: BackButtonClickEvent): void;
    }

    interface BackButtonEvent {
        sender: BackButton;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface BackButtonClickEvent extends BackButtonEvent {
        target?: JQuery;
        button?: JQuery;
    }


    class Button extends kendo.mobile.ui.Widget {
        static fn: Button;
        static extend(proto: Object): Button;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ButtonOptions);
        options: ButtonOptions;
        badge(value: string): string;
        badge(value: boolean): string;
        destroy(): void;
        enable(enable: boolean): void;
    }

    interface ButtonOptions {
        name?: string;
        badge?: string;
        enable?: boolean;
        icon?: string;
        click?(e: ButtonClickEvent): void;
    }

    interface ButtonEvent {
        sender: Button;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ButtonClickEvent extends ButtonEvent {
        target?: JQuery;
        button?: JQuery;
    }


    class ButtonGroup extends kendo.mobile.ui.Widget {
        static fn: ButtonGroup;
        static extend(proto: Object): ButtonGroup;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ButtonGroupOptions);
        options: ButtonGroupOptions;
        badge(button: string, value: string): string;
        badge(button: string, value: boolean): string;
        badge(button: number, value: string): string;
        badge(button: number, value: boolean): string;
        current(): JQuery;
        destroy(): void;
        enable(enable: boolean): void;
        select(li: JQuery): void;
        select(li: number): void;
    }

    interface ButtonGroupOptions {
        name?: string;
        enable?: boolean;
        index?: number;
        selectOn?: string;
        select?(e: ButtonGroupSelectEvent): void;
    }

    interface ButtonGroupEvent {
        sender: ButtonGroup;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ButtonGroupSelectEvent extends ButtonGroupEvent {
        index?: number;
    }


    class DetailButton extends kendo.mobile.ui.Widget {
        static fn: DetailButton;
        static extend(proto: Object): DetailButton;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: DetailButtonOptions);
        options: DetailButtonOptions;
        destroy(): void;
    }

    interface DetailButtonOptions {
        name?: string;
        click?(e: DetailButtonClickEvent): void;
    }

    interface DetailButtonEvent {
        sender: DetailButton;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface DetailButtonClickEvent extends DetailButtonEvent {
        target?: JQuery;
        button?: JQuery;
    }


    class Drawer extends kendo.mobile.ui.Widget {
        static fn: Drawer;
        static extend(proto: Object): Drawer;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: DrawerOptions);
        options: DrawerOptions;
        destroy(): void;
        hide(): void;
        show(): void;
    }

    interface DrawerOptions {
        name?: string;
        container?: JQuery;
        position?: string;
        swipeToOpen?: boolean;
        swipeToOpenViews?: any;
        title?: string;
        views?: any;
        afterHide?(e: DrawerAfterHideEvent): void;
        beforeShow?(e: DrawerEvent): void;
        hide?(e: DrawerHideEvent): void;
        init?(e: DrawerInitEvent): void;
        show?(e: DrawerShowEvent): void;
    }

    interface DrawerEvent {
        sender: Drawer;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface DrawerAfterHideEvent extends DrawerEvent {
    }

    interface DrawerHideEvent extends DrawerEvent {
    }

    interface DrawerInitEvent extends DrawerEvent {
    }

    interface DrawerShowEvent extends DrawerEvent {
    }


    class Layout extends kendo.mobile.ui.Widget {
        static fn: Layout;
        static extend(proto: Object): Layout;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: LayoutOptions);
        options: LayoutOptions;
    }

    interface LayoutOptions {
        name?: string;
        id?: string;
        platform?: string;
        hide?(e: LayoutHideEvent): void;
        init?(e: LayoutInitEvent): void;
        show?(e: LayoutShowEvent): void;
    }

    interface LayoutEvent {
        sender: Layout;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface LayoutHideEvent extends LayoutEvent {
        layout?: JQuery;
        view?: JQuery;
    }

    interface LayoutInitEvent extends LayoutEvent {
        layout?: JQuery;
    }

    interface LayoutShowEvent extends LayoutEvent {
        layout?: JQuery;
        view?: JQuery;
    }


    class ListView extends kendo.mobile.ui.Widget {
        static fn: ListView;
        static extend(proto: Object): ListView;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ListViewOptions);
        options: ListViewOptions;
        dataSource: kendo.data.DataSource;
        append(dataItems: any): void;
        prepend(dataItems: any): void;
        replace(dataItems: any): void;
        remove(dataItems: any): void;
        setDataItem(item: JQuery, dataItem: kendo.data.Model): void;
        destroy(): void;
        items(): JQuery;
        refresh(): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
    }

    interface ListViewFilterable {
        placeholder?: string;
        autoFilter?: boolean;
        field?: string;
        ignoreCase?: boolean;
        operator?: string;
    }

    interface ListViewOptions {
        name?: string;
        appendOnRefresh?: boolean;
        autoBind?: boolean;
        dataSource?: any;
        endlessScroll?: boolean;
        fixedHeaders?: boolean;
        headerTemplate?: any;
        loadMore?: boolean;
        loadMoreText?: string;
        pullToRefresh?: boolean;
        pullParameters?: Function;
        style?: string;
        template?: any;
        type?: string;
        filterable?: ListViewFilterable;
        click?(e: ListViewClickEvent): void;
        dataBound?(e: ListViewEvent): void;
        dataBinding?(e: ListViewEvent): void;
        itemChange?(e: ListViewEvent): void;
    }

    interface ListViewEvent {
        sender: ListView;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ListViewClickEvent extends ListViewEvent {
        item?: JQuery;
        target?: JQuery;
        dataItem?: any;
        button?: kendo.mobile.ui.Button;
    }


    class Loader extends kendo.mobile.ui.Widget {
        static fn: Loader;
        static extend(proto: Object): Loader;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: LoaderOptions);
        options: LoaderOptions;
        hide(): void;
        show(): void;
    }

    interface LoaderOptions {
        name?: string;
    }

    interface LoaderEvent {
        sender: Loader;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class ModalView extends kendo.mobile.ui.Widget {
        static fn: ModalView;
        static extend(proto: Object): ModalView;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ModalViewOptions);
        options: ModalViewOptions;
        close(): void;
        destroy(): void;
        open(target: JQuery): void;
    }

    interface ModalViewOptions {
        name?: string;
        height?: number;
        modal?: boolean;
        width?: number;
        beforeOpen?(e: ModalViewBeforeOpenEvent): void;
        close?(e: ModalViewCloseEvent): void;
        init?(e: ModalViewInitEvent): void;
        open?(e: ModalViewOpenEvent): void;
    }

    interface ModalViewEvent {
        sender: ModalView;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ModalViewBeforeOpenEvent extends ModalViewEvent {
        target?: JQuery;
    }

    interface ModalViewCloseEvent extends ModalViewEvent {
    }

    interface ModalViewInitEvent extends ModalViewEvent {
    }

    interface ModalViewOpenEvent extends ModalViewEvent {
        target?: JQuery;
    }


    class NavBar extends kendo.mobile.ui.Widget {
        static fn: NavBar;
        static extend(proto: Object): NavBar;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: NavBarOptions);
        options: NavBarOptions;
        destroy(): void;
        title(value: string): void;
    }

    interface NavBarOptions {
        name?: string;
    }

    interface NavBarEvent {
        sender: NavBar;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Pane extends kendo.mobile.ui.Widget {
        static fn: Pane;
        static extend(proto: Object): Pane;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: PaneOptions);
        options: PaneOptions;
        destroy(): void;
        hideLoading(): void;
        navigate(url: string, transition: string): void;
        replace(url: string, transition: string): void;
        Example(): void;
        showLoading(): void;
        view(): kendo.mobile.ui.View;
    }

    interface PaneOptions {
        name?: string;
        collapsible?: boolean;
        initial?: string;
        layout?: string;
        loading?: string;
        portraitWidth?: number;
        transition?: string;
        navigate?(e: PaneNavigateEvent): void;
        viewShow?(e: PaneViewShowEvent): void;
    }

    interface PaneEvent {
        sender: Pane;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface PaneNavigateEvent extends PaneEvent {
        url?: JQuery;
    }

    interface PaneViewShowEvent extends PaneEvent {
        view?: kendo.mobile.ui.View;
    }


    class PopOver extends kendo.mobile.ui.Widget {
        static fn: PopOver;
        static extend(proto: Object): PopOver;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: PopOverOptions);
        options: PopOverOptions;
        close(): void;
        destroy(): void;
        open(target: JQuery): void;
    }

    interface PopOverPane {
        initial?: string;
        layout?: string;
        loading?: string;
        transition?: string;
    }

    interface PopOverPopup {
        height?: any;
        width?: any;
    }

    interface PopOverOptions {
        name?: string;
        pane?: PopOverPane;
        popup?: PopOverPopup;
        close?(e: PopOverCloseEvent): void;
        open?(e: PopOverOpenEvent): void;
    }

    interface PopOverEvent {
        sender: PopOver;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface PopOverCloseEvent extends PopOverEvent {
    }

    interface PopOverOpenEvent extends PopOverEvent {
        target?: JQuery;
    }


    class ScrollView extends kendo.mobile.ui.Widget {
        static fn: ScrollView;
        static extend(proto: Object): ScrollView;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ScrollViewOptions);
        options: ScrollViewOptions;
        dataSource: kendo.data.DataSource;
        content(content: string): void;
        content(content: JQuery): void;
        destroy(): void;
        next(): void;
        prev(): void;
        refresh(): void;
        scrollTo(page: number, instant: boolean): void;
        setDataSource(dataSource: kendo.data.DataSource): void;
        value(dataItem: any): any;
    }

    interface ScrollViewOptions {
        name?: string;
        autoBind?: boolean;
        bounceVelocityThreshold?: number;
        contentHeight?: any;
        dataSource?: any;
        duration?: number;
        emptyTemplate?: string;
        enablePager?: boolean;
        itemsPerPage?: number;
        page?: number;
        pageSize?: number;
        template?: string;
        velocityThreshold?: number;
        changing?(e: ScrollViewChangingEvent): void;
        change?(e: ScrollViewChangeEvent): void;
        refresh?(e: ScrollViewRefreshEvent): void;
    }

    interface ScrollViewEvent {
        sender: ScrollView;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ScrollViewChangingEvent extends ScrollViewEvent {
        currentPage?: number;
        nextPage?: number;
    }

    interface ScrollViewChangeEvent extends ScrollViewEvent {
        page?: number;
        element?: JQuery;
        data?: any;
    }

    interface ScrollViewRefreshEvent extends ScrollViewEvent {
        pageCount?: number;
        page?: number;
    }


    class Scroller extends kendo.mobile.ui.Widget {
        static fn: Scroller;
        static extend(proto: Object): Scroller;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ScrollerOptions);
        options: ScrollerOptions;
        animatedScrollTo(x: number, y: number): void;
        destroy(): void;
        disable(): void;
        enable(): void;
        height(): number;
        pullHandled(): void;
        reset(): void;
        scrollHeight(): void;
        scrollTo(x: number, y: number): void;
        scrollWidth(): void;
        zoomOut(): void;
    }

    interface ScrollerOptions {
        name?: string;
        elastic?: boolean;
        pullOffset?: number;
        pullTemplate?: string;
        pullToRefresh?: boolean;
        refreshTemplate?: string;
        releaseTemplate?: string;
        useNative?: boolean;
        visibleScrollHints?: boolean;
        zoom?: boolean;
        pull?(e: ScrollerEvent): void;
        resize?(e: ScrollerEvent): void;
        scroll?(e: ScrollerScrollEvent): void;
    }

    interface ScrollerEvent {
        sender: Scroller;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ScrollerScrollEvent extends ScrollerEvent {
        scrollTop?: number;
        scrollLeft?: number;
    }


    class SplitView extends kendo.mobile.ui.Widget {
        static fn: SplitView;
        static extend(proto: Object): SplitView;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: SplitViewOptions);
        options: SplitViewOptions;
        destroy(): void;
        expandPanes(): void;
        collapsePanes(): void;
    }

    interface SplitViewOptions {
        name?: string;
        style?: string;
        init?(e: SplitViewInitEvent): void;
        show?(e: SplitViewShowEvent): void;
    }

    interface SplitViewEvent {
        sender: SplitView;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface SplitViewInitEvent extends SplitViewEvent {
        view?: JQuery;
    }

    interface SplitViewShowEvent extends SplitViewEvent {
        view?: JQuery;
    }


    class Switch extends kendo.mobile.ui.Widget {
        static fn: Switch;
        static extend(proto: Object): Switch;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: SwitchOptions);
        options: SwitchOptions;
        check(): boolean;
        check(check: boolean): void;
        destroy(): void;
        enable(enable: boolean): void;
        refresh(): void;
        toggle(): void;
    }

    interface SwitchOptions {
        name?: string;
        checked?: boolean;
        enable?: boolean;
        offLabel?: string;
        onLabel?: string;
        change?(e: SwitchChangeEvent): void;
    }

    interface SwitchEvent {
        sender: Switch;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface SwitchChangeEvent extends SwitchEvent {
        checked?: any;
    }


    class TabStrip extends kendo.mobile.ui.Widget {
        static fn: TabStrip;
        static extend(proto: Object): TabStrip;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: TabStripOptions);
        options: TabStripOptions;
        badge(tab: string, value: string): string;
        badge(tab: string, value: boolean): string;
        badge(tab: number, value: string): string;
        badge(tab: number, value: boolean): string;
        currentItem(): JQuery;
        destroy(): void;
        switchTo(url: string): void;
        switchTo(url: number): void;
        switchByFullUrl(url: string): void;
        clear(): void;
    }

    interface TabStripOptions {
        name?: string;
        selectedIndex?: number;
        select?(e: TabStripSelectEvent): void;
    }

    interface TabStripEvent {
        sender: TabStrip;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface TabStripSelectEvent extends TabStripEvent {
        item?: JQuery;
    }


    class View extends kendo.mobile.ui.Widget {
        static fn: View;
        static extend(proto: Object): View;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ViewOptions);
        options: ViewOptions;
        contentElement(): void;
        destroy(): void;
        enable(enable: boolean): void;
    }

    interface ViewOptions {
        name?: string;
        model?: string;
        reload?: boolean;
        scroller?: any;
        stretch?: boolean;
        title?: string;
        useNativeScrolling?: boolean;
        zoom?: boolean;
        afterShow?(e: ViewAfterShowEvent): void;
        beforeHide?(e: ViewBeforeHideEvent): void;
        beforeShow?(e: ViewBeforeShowEvent): void;
        hide?(e: ViewHideEvent): void;
        init?(e: ViewInitEvent): void;
        show?(e: ViewShowEvent): void;
        transitionStart?(e: ViewTransitionStartEvent): void;
        transitionEnd?(e: ViewTransitionEndEvent): void;
    }

    interface ViewEvent {
        sender: View;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ViewAfterShowEvent extends ViewEvent {
        view?: kendo.mobile.ui.View;
    }

    interface ViewBeforeHideEvent extends ViewEvent {
        view?: kendo.mobile.ui.View;
    }

    interface ViewBeforeShowEvent extends ViewEvent {
        view?: kendo.mobile.ui.View;
    }

    interface ViewHideEvent extends ViewEvent {
        view?: kendo.mobile.ui.View;
    }

    interface ViewInitEvent extends ViewEvent {
        view?: kendo.mobile.ui.View;
    }

    interface ViewShowEvent extends ViewEvent {
        view?: kendo.mobile.ui.View;
    }

    interface ViewTransitionStartEvent extends ViewEvent {
        type?: string;
    }

    interface ViewTransitionEndEvent extends ViewEvent {
        type?: string;
    }


}

interface HTMLElement {
    kendoBindingTarget: kendo.data.Binding;
}

interface JQueryXHR {
}

interface JQueryEventObject {
}

interface JQueryPromise<T> {
}

interface JQuery {

    kendoDraggable(): JQuery;
    kendoDraggable(options: kendo.ui.DraggableOptions): JQuery;

    kendoDropTarget(): JQuery;
    kendoDropTarget(options: kendo.ui.DropTargetOptions): JQuery;

    kendoDropTargetArea(): JQuery;
    kendoDropTargetArea(options: kendo.ui.DropTargetAreaOptions): JQuery;

    data(key: any): any;

    kendoAutoComplete(): JQuery;
    kendoAutoComplete(options: kendo.ui.AutoCompleteOptions): JQuery;
    data(key: "kendoAutoComplete") : kendo.ui.AutoComplete;

    kendoBarcode(): JQuery;
    kendoBarcode(options: kendo.dataviz.ui.BarcodeOptions): JQuery;
    data(key: "kendoBarcode") : kendo.dataviz.ui.Barcode;

    kendoButton(): JQuery;
    kendoButton(options: kendo.ui.ButtonOptions): JQuery;
    data(key: "kendoButton") : kendo.ui.Button;

    kendoCalendar(): JQuery;
    kendoCalendar(options: kendo.ui.CalendarOptions): JQuery;
    data(key: "kendoCalendar") : kendo.ui.Calendar;

    kendoChart(): JQuery;
    kendoChart(options: kendo.dataviz.ui.ChartOptions): JQuery;
    data(key: "kendoChart") : kendo.dataviz.ui.Chart;

    kendoColorPalette(): JQuery;
    kendoColorPalette(options: kendo.ui.ColorPaletteOptions): JQuery;
    data(key: "kendoColorPalette") : kendo.ui.ColorPalette;

    kendoColorPicker(): JQuery;
    kendoColorPicker(options: kendo.ui.ColorPickerOptions): JQuery;
    data(key: "kendoColorPicker") : kendo.ui.ColorPicker;

    kendoComboBox(): JQuery;
    kendoComboBox(options: kendo.ui.ComboBoxOptions): JQuery;
    data(key: "kendoComboBox") : kendo.ui.ComboBox;

    kendoContextMenu(): JQuery;
    kendoContextMenu(options: kendo.ui.ContextMenuOptions): JQuery;
    data(key: "kendoContextMenu") : kendo.ui.ContextMenu;

    kendoDatePicker(): JQuery;
    kendoDatePicker(options: kendo.ui.DatePickerOptions): JQuery;
    data(key: "kendoDatePicker") : kendo.ui.DatePicker;

    kendoDateTimePicker(): JQuery;
    kendoDateTimePicker(options: kendo.ui.DateTimePickerOptions): JQuery;
    data(key: "kendoDateTimePicker") : kendo.ui.DateTimePicker;

    kendoDiagram(): JQuery;
    kendoDiagram(options: kendo.dataviz.ui.DiagramOptions): JQuery;
    data(key: "kendoDiagram") : kendo.dataviz.ui.Diagram;

    kendoDropDownList(): JQuery;
    kendoDropDownList(options: kendo.ui.DropDownListOptions): JQuery;
    data(key: "kendoDropDownList") : kendo.ui.DropDownList;

    kendoEditor(): JQuery;
    kendoEditor(options: kendo.ui.EditorOptions): JQuery;
    data(key: "kendoEditor") : kendo.ui.Editor;

    kendoFlatColorPicker(): JQuery;
    kendoFlatColorPicker(options: kendo.ui.FlatColorPickerOptions): JQuery;
    data(key: "kendoFlatColorPicker") : kendo.ui.FlatColorPicker;

    kendoGantt(): JQuery;
    kendoGantt(options: kendo.ui.GanttOptions): JQuery;
    data(key: "kendoGantt") : kendo.ui.Gantt;

    kendoGrid(): JQuery;
    kendoGrid(options: kendo.ui.GridOptions): JQuery;
    data(key: "kendoGrid") : kendo.ui.Grid;

    kendoLinearGauge(): JQuery;
    kendoLinearGauge(options: kendo.dataviz.ui.LinearGaugeOptions): JQuery;
    data(key: "kendoLinearGauge") : kendo.dataviz.ui.LinearGauge;

    kendoListView(): JQuery;
    kendoListView(options: kendo.ui.ListViewOptions): JQuery;
    data(key: "kendoListView") : kendo.ui.ListView;

    kendoMap(): JQuery;
    kendoMap(options: kendo.dataviz.ui.MapOptions): JQuery;
    data(key: "kendoMap") : kendo.dataviz.ui.Map;

    kendoMaskedTextBox(): JQuery;
    kendoMaskedTextBox(options: kendo.ui.MaskedTextBoxOptions): JQuery;
    data(key: "kendoMaskedTextBox") : kendo.ui.MaskedTextBox;

    kendoMenu(): JQuery;
    kendoMenu(options: kendo.ui.MenuOptions): JQuery;
    data(key: "kendoMenu") : kendo.ui.Menu;

    kendoMobileActionSheet(): JQuery;
    kendoMobileActionSheet(options: kendo.mobile.ui.ActionSheetOptions): JQuery;
    data(key: "kendoMobileActionSheet") : kendo.mobile.ui.ActionSheet;

    kendoMobileBackButton(): JQuery;
    kendoMobileBackButton(options: kendo.mobile.ui.BackButtonOptions): JQuery;
    data(key: "kendoMobileBackButton") : kendo.mobile.ui.BackButton;

    kendoMobileButton(): JQuery;
    kendoMobileButton(options: kendo.mobile.ui.ButtonOptions): JQuery;
    data(key: "kendoMobileButton") : kendo.mobile.ui.Button;

    kendoMobileButtonGroup(): JQuery;
    kendoMobileButtonGroup(options: kendo.mobile.ui.ButtonGroupOptions): JQuery;
    data(key: "kendoMobileButtonGroup") : kendo.mobile.ui.ButtonGroup;

    kendoMobileDetailButton(): JQuery;
    kendoMobileDetailButton(options: kendo.mobile.ui.DetailButtonOptions): JQuery;
    data(key: "kendoMobileDetailButton") : kendo.mobile.ui.DetailButton;

    kendoMobileDrawer(): JQuery;
    kendoMobileDrawer(options: kendo.mobile.ui.DrawerOptions): JQuery;
    data(key: "kendoMobileDrawer") : kendo.mobile.ui.Drawer;

    kendoMobileLayout(): JQuery;
    kendoMobileLayout(options: kendo.mobile.ui.LayoutOptions): JQuery;
    data(key: "kendoMobileLayout") : kendo.mobile.ui.Layout;

    kendoMobileListView(): JQuery;
    kendoMobileListView(options: kendo.mobile.ui.ListViewOptions): JQuery;
    data(key: "kendoMobileListView") : kendo.mobile.ui.ListView;

    kendoMobileLoader(): JQuery;
    kendoMobileLoader(options: kendo.mobile.ui.LoaderOptions): JQuery;
    data(key: "kendoMobileLoader") : kendo.mobile.ui.Loader;

    kendoMobileModalView(): JQuery;
    kendoMobileModalView(options: kendo.mobile.ui.ModalViewOptions): JQuery;
    data(key: "kendoMobileModalView") : kendo.mobile.ui.ModalView;

    kendoMobileNavBar(): JQuery;
    kendoMobileNavBar(options: kendo.mobile.ui.NavBarOptions): JQuery;
    data(key: "kendoMobileNavBar") : kendo.mobile.ui.NavBar;

    kendoMobilePane(): JQuery;
    kendoMobilePane(options: kendo.mobile.ui.PaneOptions): JQuery;
    data(key: "kendoMobilePane") : kendo.mobile.ui.Pane;

    kendoMobilePopOver(): JQuery;
    kendoMobilePopOver(options: kendo.mobile.ui.PopOverOptions): JQuery;
    data(key: "kendoMobilePopOver") : kendo.mobile.ui.PopOver;

    kendoMobileScrollView(): JQuery;
    kendoMobileScrollView(options: kendo.mobile.ui.ScrollViewOptions): JQuery;
    data(key: "kendoMobileScrollView") : kendo.mobile.ui.ScrollView;

    kendoMobileScroller(): JQuery;
    kendoMobileScroller(options: kendo.mobile.ui.ScrollerOptions): JQuery;
    data(key: "kendoMobileScroller") : kendo.mobile.ui.Scroller;

    kendoMobileSplitView(): JQuery;
    kendoMobileSplitView(options: kendo.mobile.ui.SplitViewOptions): JQuery;
    data(key: "kendoMobileSplitView") : kendo.mobile.ui.SplitView;

    kendoMobileSwitch(): JQuery;
    kendoMobileSwitch(options: kendo.mobile.ui.SwitchOptions): JQuery;
    data(key: "kendoMobileSwitch") : kendo.mobile.ui.Switch;

    kendoMobileTabStrip(): JQuery;
    kendoMobileTabStrip(options: kendo.mobile.ui.TabStripOptions): JQuery;
    data(key: "kendoMobileTabStrip") : kendo.mobile.ui.TabStrip;

    kendoMobileView(): JQuery;
    kendoMobileView(options: kendo.mobile.ui.ViewOptions): JQuery;
    data(key: "kendoMobileView") : kendo.mobile.ui.View;

    kendoMultiSelect(): JQuery;
    kendoMultiSelect(options: kendo.ui.MultiSelectOptions): JQuery;
    data(key: "kendoMultiSelect") : kendo.ui.MultiSelect;

    kendoNotification(): JQuery;
    kendoNotification(options: kendo.ui.NotificationOptions): JQuery;
    data(key: "kendoNotification") : kendo.ui.Notification;

    kendoNumericTextBox(): JQuery;
    kendoNumericTextBox(options: kendo.ui.NumericTextBoxOptions): JQuery;
    data(key: "kendoNumericTextBox") : kendo.ui.NumericTextBox;

    kendoPager(): JQuery;
    kendoPager(options: kendo.ui.PagerOptions): JQuery;
    data(key: "kendoPager") : kendo.ui.Pager;

    kendoPanelBar(): JQuery;
    kendoPanelBar(options: kendo.ui.PanelBarOptions): JQuery;
    data(key: "kendoPanelBar") : kendo.ui.PanelBar;

    kendoPivotConfigurator(): JQuery;
    kendoPivotConfigurator(options: kendo.ui.PivotConfiguratorOptions): JQuery;
    data(key: "kendoPivotConfigurator") : kendo.ui.PivotConfigurator;

    kendoPivotGrid(): JQuery;
    kendoPivotGrid(options: kendo.ui.PivotGridOptions): JQuery;
    data(key: "kendoPivotGrid") : kendo.ui.PivotGrid;

    kendoProgressBar(): JQuery;
    kendoProgressBar(options: kendo.ui.ProgressBarOptions): JQuery;
    data(key: "kendoProgressBar") : kendo.ui.ProgressBar;

    kendoQRCode(): JQuery;
    kendoQRCode(options: kendo.dataviz.ui.QRCodeOptions): JQuery;
    data(key: "kendoQRCode") : kendo.dataviz.ui.QRCode;

    kendoRadialGauge(): JQuery;
    kendoRadialGauge(options: kendo.dataviz.ui.RadialGaugeOptions): JQuery;
    data(key: "kendoRadialGauge") : kendo.dataviz.ui.RadialGauge;

    kendoRangeSlider(): JQuery;
    kendoRangeSlider(options: kendo.ui.RangeSliderOptions): JQuery;
    data(key: "kendoRangeSlider") : kendo.ui.RangeSlider;

    kendoScheduler(): JQuery;
    kendoScheduler(options: kendo.ui.SchedulerOptions): JQuery;
    data(key: "kendoScheduler") : kendo.ui.Scheduler;

    kendoSlider(): JQuery;
    kendoSlider(options: kendo.ui.SliderOptions): JQuery;
    data(key: "kendoSlider") : kendo.ui.Slider;

    kendoSortable(): JQuery;
    kendoSortable(options: kendo.ui.SortableOptions): JQuery;
    data(key: "kendoSortable") : kendo.ui.Sortable;

    kendoSparkline(): JQuery;
    kendoSparkline(options: kendo.dataviz.ui.SparklineOptions): JQuery;
    data(key: "kendoSparkline") : kendo.dataviz.ui.Sparkline;

    kendoSplitter(): JQuery;
    kendoSplitter(options: kendo.ui.SplitterOptions): JQuery;
    data(key: "kendoSplitter") : kendo.ui.Splitter;

    kendoStockChart(): JQuery;
    kendoStockChart(options: kendo.dataviz.ui.StockChartOptions): JQuery;
    data(key: "kendoStockChart") : kendo.dataviz.ui.StockChart;

    kendoTabStrip(): JQuery;
    kendoTabStrip(options: kendo.ui.TabStripOptions): JQuery;
    data(key: "kendoTabStrip") : kendo.ui.TabStrip;

    kendoTimePicker(): JQuery;
    kendoTimePicker(options: kendo.ui.TimePickerOptions): JQuery;
    data(key: "kendoTimePicker") : kendo.ui.TimePicker;

    kendoToolBar(): JQuery;
    kendoToolBar(options: kendo.ui.ToolBarOptions): JQuery;
    data(key: "kendoToolBar") : kendo.ui.ToolBar;

    kendoTooltip(): JQuery;
    kendoTooltip(options: kendo.ui.TooltipOptions): JQuery;
    data(key: "kendoTooltip") : kendo.ui.Tooltip;

    kendoTouch(): JQuery;
    kendoTouch(options: kendo.ui.TouchOptions): JQuery;
    data(key: "kendoTouch") : kendo.ui.Touch;

    kendoTreeMap(): JQuery;
    kendoTreeMap(options: kendo.dataviz.ui.TreeMapOptions): JQuery;
    data(key: "kendoTreeMap") : kendo.dataviz.ui.TreeMap;

    kendoTreeView(): JQuery;
    kendoTreeView(options: kendo.ui.TreeViewOptions): JQuery;
    data(key: "kendoTreeView") : kendo.ui.TreeView;

    kendoUpload(): JQuery;
    kendoUpload(options: kendo.ui.UploadOptions): JQuery;
    data(key: "kendoUpload") : kendo.ui.Upload;

    kendoValidator(): JQuery;
    kendoValidator(options: kendo.ui.ValidatorOptions): JQuery;
    data(key: "kendoValidator") : kendo.ui.Validator;

    kendoWindow(): JQuery;
    kendoWindow(options: kendo.ui.WindowOptions): JQuery;
    data(key: "kendoWindow") : kendo.ui.Window;

}
