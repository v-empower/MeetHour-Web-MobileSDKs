using MeethourExample_Asp.Cs;

namespace MeethourExample_Asp {
public class Startup {
    public Startup(IConfiguration configuration) {
        Configuration = configuration;
    }

    public IConfiguration Configuration {
        get;
    }

    // This method gets called by the runtime. Use this method to add services to
    // the container.
    public void ConfigureServices(IServiceCollection services) {
        services.AddRazorPages(
        options => {
            options.Conventions.AddPageRoute("/Home/Index", "");
        });
        services.AddRazorPages(options => {
            options.Conventions.AddPageRoute("/Home/ScheduleMeeting",
                                             "ScheduleMeeting");
        });
        services.AddRazorPages(options => {
            options.Conventions.AddPageRoute("/Home/JoinMeeting", "JoinMeeting");
        });
        services.AddSession();
        services.AddSingleton<MeethourExample_Asp.Cs.Index>();
        services.AddSingleton<AccessToken>();
        services.AddSingleton<MeethourExample_Asp.Cs.AccessToken>();
        services.AddControllersWithViews();
        // Other service configurations...
    }

    // This method gets called by the runtime. Use this method to configure the
    // HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
        if (env.IsDevelopment()) {
            app.UseDeveloperExceptionPage();
        } else {
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseSession();
        app.UseRouting();
        app.UseEndpoints(endpoints => {
            endpoints.MapRazorPages();
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
            endpoints.MapControllerRoute(
                name: "scheduleMeeting", pattern: "ScheduleMeeting",
                defaults: new { controller = "ScheduleMeeting",
                                action = "ScheduleMeeting"
                              });
            endpoints.MapControllerRoute(
                name: "JoinMeeting", pattern: "JoinMeeting",
                defaults: new { controller = "JoinMeeting", action = "JoinMeeting" });
        });
    }
}
}
