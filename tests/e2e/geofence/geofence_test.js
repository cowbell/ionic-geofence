import protractor from "protractor";
import net from "net";

const EC = protractor.ExpectedConditions;

describe("Geofence test", () => {
    let emuConnection;
    let isSauce = false;
    let isLocal = true;

    beforeAll((done) => {
        browser.getProcessedConfig()
            .then((config) => {
                isLocal = config.sauceUser === undefined;
                isSauce = config.sauceUser !== undefined;
            })
            .then(() => {
                if (!isSauce) {
                    emuConnection = net.connect("5554", "localhost");
                    emuConnection.on("connect", done);
                } else {
                    done();
                }
            });
    });

    function addGeofence(notificationText) {
        const addGeofenceButton = element(by.css(".ion-plus"));
        const saveGeofenceButton = element(by.css(".ion-checkmark"));
        const notificationTextInput = element(by.model("geofence.notification.text"));

        geoFix(50.28, 18.67);
        addGeofenceButton.click();

        //workaround protractor doesn't wait for html geolocation API to resolve
        browser.wait(EC.presenceOf(notificationTextInput), 20000);
        notificationTextInput.sendKeys(notificationText);
        saveGeofenceButton.click();
    }

    function geoFix(longitude, latitude) {
        if (isSauce) {
            wdBrowser.setGeoLocation(longitude, latitude);
        } else {
            //telnet geofix works on most of emulators, wdBrowser.setGeoLocation only on android-6
            emuConnection.write(`geo fix ${longitude} ${latitude}\n`);
        }
    }

    afterAll(() => {
        if (emuConnection) {
            emuConnection.destroy();
        }
    });

    it("should add geofence", (done) => {
        const geofenceList = element.all(by.repeater("geofence in geofences"));
        const firstGeofence = element(by.cssContainingText("ion-item", "Tested geofence region"));
        addGeofence("Tested geofence region");

        browser.wait(EC.presenceOf(firstGeofence), 3000);
        expect(geofenceList.count()).toBe(1);
        expect(geofenceList.first().getText()).toContain("Tested geofence region");
        done();
    });

    it("should remove added geofence", (done) => {
        const removeButton = element(by.css(".ion-trash-b"));
        const geofenceList = element.all(by.repeater("geofence in geofences"));
        const firstGeofence = element(by.cssContainingText("ion-item", "Tested geofence region"));

        expect(geofenceList.count()).toBe(1);
        removeButton.click();
        browser.wait(EC.stalenessOf(firstGeofence), 3000);
        expect(geofenceList.count()).toBe(0);
        done();
    });

    it("should remove all added geofences", (done) => {
        const moreOptionsButton = element(by.css(".ion-more"));
        const removeAllButton = element(by.buttonText("Delete all geofences"));
        const geofenceList = element.all(by.repeater("geofence in geofences"));
        const secondGeofence = element(by.cssContainingText("ion-item", "Second geofence"));

        addGeofence("First geofence");
        addGeofence("Second geofence");

        browser.wait(EC.presenceOf(secondGeofence), 3000);
        expect(geofenceList.count()).toBe(2);
        moreOptionsButton.click();
        browser.wait(EC.presenceOf(removeAllButton), 1000);
        removeAllButton.click();
        browser.wait(EC.stalenessOf(secondGeofence), 3000);
        expect(geofenceList.count()).toBe(0);
        done();
    });
});
