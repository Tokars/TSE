namespace TSE {
    export class ZoneManager {

        private static _globalZoneID: number = -1;
        private static _zone: { [id: number]: Zone } = {};
        private static _activeZone: Zone;
        private constructor() {

        }

        public static createZone(name: string, description: string): number {
            ZoneManager._globalZoneID++;
            let zone = new Zone(ZoneManager._globalZoneID, name, description);
            ZoneManager._zone[ZoneManager._globalZoneID] = zone;

            return ZoneManager._globalZoneID;
        }
        
        // Temporary 
        public static createTestZone():number{
            ZoneManager._globalZoneID++;
            let zone = new TestZone(ZoneManager._globalZoneID, "test", "A simple Test zone.");
            ZoneManager._zone[ZoneManager._globalZoneID] = zone;

            return ZoneManager._globalZoneID;
        }

        public static changeZone(id: number): void {

            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.onDeactivated();
                ZoneManager._activeZone.unload();
            }
            if (ZoneManager._zone[id] !== undefined) {
                ZoneManager._activeZone = ZoneManager._zone[id];
                ZoneManager._activeZone.onActivated();
                ZoneManager._activeZone.load();
            } else {
                throw new Error(`game zone with id [${id}] not exists.`);
            }
        }
        
      

        public static update(time: number): void {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.update(time);
            }
        }

        public static render(shader: Shader): void {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.render(shader);
            }
        }
    }
}