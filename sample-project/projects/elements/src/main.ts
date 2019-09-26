import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { ProviderAppModule } from './app/provider-app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if (!environment.zoneScoped) {
  platformBrowserDynamic()
    .bootstrapModule(ProviderAppModule, getCompilerOptions())
    .catch(err => console.error(err));
} else {
  import('../../helpers/src/zone-hack/scoped-zone').then(() => {
    const Zone = (window as any)['Zone'];
    try {
      // init zone
      Zone.__init__();
      platformBrowserDynamic()
        .bootstrapModule(ProviderAppModule)
        .then(ref => {
          // Ensure Angular destroys itself on hot reloads.
          if (window['ngRef']) {
            window['ngRef'].destroy();
          }
          window['ngRef'] = ref;

          // Otherise, log the boot error
        })
        .catch(err => console.error(err));
    } finally {
      // unload all monkey-patch, so Window/Global API will be
      // reverted to native one. No impact to outside world.
      Zone.__unloadAll_patch();
    }
  });
}

console.log('Provider environment name:', environment.name);
console.log('Provider encapsulation: ', getEncapsulation(environment.encapsulation));
console.log('Provider zone usage: ', environment.zoneLess ? 'Zone-Less' : 'Zone-Full');
console.log('Provider changeDetection: ', environment.changeDetection === 0 ? 'Default' : 'OnPush');
console.log('Provider compilerOptions:', getCompilerOptions());
console.log('Provider compilation for:', environment.preCompiled ? 'PreCompiled' : 'UnCompiled');

function getCompilerOptions() {
  // If consumer app offers a setting (can be controlled or stand-alone)
  const ngZone = (window as any).ngZone;
  if (ngZone) {
    return { ngZone };
  }
  // If configuration is zone-less (can be controlled or stand-alone)
  // if(environment.zoneLess) {}
  return {};
}

function getEncapsulation(encapsulation) {
  if (encapsulation === 0) {
    return 'Emulated';
  }
  if (encapsulation === 1) {
    return 'Native';
  }
  if (encapsulation === 2) {
    return 'None';
  }
  if (encapsulation === 3) {
    return 'ShadowDom';
  }
  return 'WRONG ENCAPSULATION!!';
}
