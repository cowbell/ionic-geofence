import protractor from "protractor";

const EC = protractor.ExpectedConditions;

describe("Geofence test", () => {
    beforeEach(() => {
    });

    afterEach(() => {
    });

    it("should add geofence", () => {
        const addGeofenceButton = element(by.css(".ion-plus"));
        const saveGeofenceButton = element(by.css(".ion-checkmark"));
        const notificationTextInput = element(by.model("geofence.notification.text"));
        // const notificationTextInput = element(by.css("input[placeholder='Enter notification text']"));

        addGeofenceButton.click();
        // browser.wait(EC.presenceOf(notificationTextInput), 5000);
        notificationTextInput.sendKeys("This is notification");
        saveGeofenceButton.click();

        expect(element.all(by.repeater("geofence in geofences")).count()).toBe(1);
    });
});
