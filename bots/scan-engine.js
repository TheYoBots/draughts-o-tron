const ScanEngine = require("../engines/scan-engine");

/**
 * Get the moves from scan engine
 */
class ScanEngineBot {
    getEngine() {
        return new ScanEngine({
            initialized: () => {
                console.log("Scan Engine is initialized");
            }
        });
    }

    getReply(chat) {
        return "Running Scan Engine with draught-o-tron";
    }
}

module.exports = ScanEngineBot;
