var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { IDL, query, update } from 'azle';
let default_1 = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _fundProject_decorators;
    let _getProjectFunds_decorators;
    let _getAllProjects_decorators;
    return _a = class default_1 {
            constructor() {
                this.projects = (__runInitializers(this, _instanceExtraInitializers), {});
            }
            // Method to fund a project
            fundProject(projectId, amount) {
                if (this.projects[projectId]) {
                    this.projects[projectId].totalFunds += amount; // Add to existing funds
                }
                else {
                    // If project does not exist, create it
                    this.projects[projectId] = { id: projectId, name: `Project ${projectId}`, totalFunds: amount };
                }
                return `Funded ${amount} cycles to Project ${projectId}`;
            }
            // Query method to get the funding details for a project
            getProjectFunds(projectId) {
                return this.projects[projectId] || null;
            }
            // Query method to retrieve all projects with funding details
            getAllProjects() {
                return Object.values(this.projects);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fundProject_decorators = [update([IDL.Text, IDL.Nat64])];
            _getProjectFunds_decorators = [query([IDL.Text], IDL.Opt(IDL.Record({ id: IDL.Text, name: IDL.Text, totalFunds: IDL.Nat64 })))];
            _getAllProjects_decorators = [query([], IDL.Vec(IDL.Record({ id: IDL.Text, name: IDL.Text, totalFunds: IDL.Nat64 })))];
            __esDecorate(_a, null, _fundProject_decorators, { kind: "method", name: "fundProject", static: false, private: false, access: { has: obj => "fundProject" in obj, get: obj => obj.fundProject }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getProjectFunds_decorators, { kind: "method", name: "getProjectFunds", static: false, private: false, access: { has: obj => "getProjectFunds" in obj, get: obj => obj.getProjectFunds }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getAllProjects_decorators, { kind: "method", name: "getAllProjects", static: false, private: false, access: { has: obj => "getAllProjects" in obj, get: obj => obj.getAllProjects }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export default default_1;
