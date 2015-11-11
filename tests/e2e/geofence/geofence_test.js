import protractor from "protractor";
import net from "net";

const EC = protractor.ExpectedConditions;

describe("Geofence test", () => {
    const emuConnection = net.connect("5554", "localhost");

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

    //telnet geofix works on most of emulators, wdBrowser.setGeoLocation only on android-6
    function geoFix(longitude, latitude) {
        emuConnection.write(`geo fix ${longitude} ${latitude}\n`);
    }

    afterAll(() => emuConnection.destroy());

    it("should add geofence", (done) => {
        const geofenceList = element.all(by.repeater("geofence in geofences"));
        const firstListElement = element(by.css("ion-item:first-child"));
        addGeofence("Tested geofence region");

        browser.wait(EC.presenceOf(firstListElement), 3000);
        expect(geofenceList.count()).toBe(1);
        expect(geofenceList.first().getText()).toContain("Tested geofence region");
        done();
    });

    it("should remove added geofence", (done) => {
        const removeButton = element(by.css(".ion-trash-b"));
        const geofenceList = element.all(by.repeater("geofence in geofences"));
        const firstListElement = element(by.css("ion-item:first-child"));

        browser.wait(EC.presenceOf(firstListElement), 3000);
        expect(geofenceList.count()).toBe(1);
        removeButton.click();
        browser.wait(EC.stalenessOf(firstListElement), 3000);
        expect(geofenceList.count()).toBe(0);
        done();
    });

    it("should remove all added geofences", (done) => {
        const moreOptionsButton = element(by.css(".ion-more"));
        const removeAllButton = element(by.buttonText("Delete all geofences"));
        const geofenceList = element.all(by.repeater("geofence in geofences"));

        addGeofence("First geofence");
        addGeofence("Second geofences");

        expect(geofenceList.count()).toBe(2);
        moreOptionsButton.click();
        removeAllButton.click();
        expect(geofenceList.count()).toBe(0);
        done();
    });
});
