"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const BuildCalculator_1 = require("./components/BuildCalculator");
require("./App.css");
function App() {
    return (<div className="App">
      <header className="App-header bg-gray-800 text-white p-4">
        <h1 className="text-3xl font-bold">MLBB Community Platform</h1>
      </header>
      <main className="container mx-auto p-4">
        <BuildCalculator_1.BuildCalculator />
      </main>
    </div>);
}
exports.default = App;
//# sourceMappingURL=App.js.map