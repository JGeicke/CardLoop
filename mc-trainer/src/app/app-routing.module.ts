import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ImportModulesPageModule} from './import-modules/import-modules-page.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
  },
  {
    path: 'navbar',
    loadChildren: () => import('./navbar/navbar.module').then(m => m.NavbarPageModule)
  },

  {
    path: 'import-modules',
    loadChildren: () => import('./import-modules/import-modules-page.module').then(m => ImportModulesPageModule)
  },
  {
    path: 'popover',
    loadChildren: () => import('./popover/popover.module').then(m => m.PopoverPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackPageModule)
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingPageModule)
  },  {
    path: 'add-modules',
    loadChildren: () => import('./module/add-modules/add-modules.module').then( m => m.AddModulesPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
