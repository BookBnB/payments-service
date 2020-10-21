// features/support/world.js
import { setWorldConstructor } from "@cucumber/cucumber";

class CustomWorld {
	constructor() {
	}
}

setWorldConstructor(CustomWorld);