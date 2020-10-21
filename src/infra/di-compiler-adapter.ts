import {di} from '@wessberg/di-compiler'
import {Program} from "typescript";
import {PluginConfig} from "ttypescript/lib/PluginCreator";

export default (program: Program, config?: PluginConfig) => di({program})
