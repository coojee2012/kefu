/**
 * Created by Administrator on 2017/5/11.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { ServerErrorComponent } from './shared/server-error/server-error.component';


// import { CanDeactivateGuard }       from './can-deactivate-guard.service';
// import { AuthGuard }                from './auth-guard.service';
// import { SelectivePreloadingStrategy } from './selective-preloading-strategy';
export const appRoutes: Routes = [
  // { path: '', loadChildren: 'app/pages/home/home.module#HomeModule' },
  { path: 'login', loadChildren: 'app/pages/login/login.module#LoginModule' },
  // { path: 'register', loadChildren: 'app/pages/register/register.module#RegisterModule' },
  // { path: 'forget', loadChildren: 'app/pages/forget/forget.module#ForgetModule' },
  // { path: 'user', loadChildren: 'app/pages/user/user.module#UserModule' },
  // { path: 'settings', loadChildren: 'app/pages/settings/settings.module#SettingsModule' },
  // { path: 'bookmarks', loadChildren: 'app/pages/bookmarks/bookmarks.module#BookmarksModule' },
  // { path: 'notifications', loadChildren: 'app/pages/notifications/notifications.module#NotificationsModule' },
  // { path: 'writer', loadChildren: 'app/pages/writer/writer.module#WriterModule' },
  // { path: 'article', loadChildren: 'app/pages/article/article.module#ArticleModule' },
  // { path: 'books', loadChildren: 'app/pages/books/books.module#BooksModule' },
  // { path: 'collections', loadChildren: 'app/pages/collections/collections.module#CollectionsModule' },
  // { path: 'contact', loadChildren: 'app/pages/contact/contact.module#ContactModule' },
  // { path: 'help', loadChildren: 'app/pages/help/help.module#HelpModule' },
  // { path: 'faqs', loadChildren: 'app/pages/faqs/faqs.module#FaqsModule' },
  // { path: 'recommendations', loadChildren: 'app/pages/recommendations/recommendations.module#RecommendationsModule' },
  // { path: 'subscriptions', loadChildren: 'app/pages/subscriptions/subscriptions.module#SubscriptionsModule' },
  // { path: 'trending', loadChildren: 'app/pages/trending/trending.module#TrendingModule' },
  // { path: 'publications', loadChildren: 'app/pages/publications/publications.module#PublicationsModule' },
  // { path: 'search', loadChildren: 'app/pages/search/search.module#SearchModule' },
  // { path: 'home', loadChildren: 'app/pages/home/home.module#HomeModule' },
  { path: 'app', loadChildren: 'app/pages/apps/apps.module#AppsModule' },
  { path: '404', component: NotFoundComponent },
  { path: '500', component: ServerErrorComponent },
  { path: '', pathMatch: 'full', redirectTo: '/app' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: true, // <-- debugging purposes only
      //  preloadingStrategy: SelectivePreloadingStrategy,

      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
   // CanDeactivateGuard,
   // SelectivePreloadingStrategy
  ]
})
export class AppRoutingModule { }
// export const ROUTING = RouterModule.forRoot(ROUTER_CONFIG, { enableTracing: false });
