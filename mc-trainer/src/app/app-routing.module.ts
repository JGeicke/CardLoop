import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'logged-in',
    pathMatch: 'full'
  },
  {
    path: 'learn-mode',
    loadChildren: () => import('./learnMode/learn-mode/learn-mode.module').then( m => m.LearnModePageModule)
  },
  {
    path: 'logged-in',
    loadChildren: () => import('./loggedIn/logged-in/logged-in.module').then( m => m.LoggedInPageModule)
  },
  {
    path: 'module-detail',
    loadChildren: () => import('./module/module-detail/module-detail.module').then( m => m.ModuleDetailPageModule)
  },
  {
    path: 'module-list',
    loadChildren: () => import('./module/module-list/module-list.module').then( m => m.ModuleListPageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./userProfile/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'achievement',
    loadChildren: () => import('./achievement/achievement/achievement.module').then( m => m.AchievementPageModule)
  },  {
    path: 'import-modules',
    loadChildren: () => import('./import-modules/import-modules.module').then( m => m.ImportModulesPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
