import WidgetKit
import SwiftUI

struct ArticleData: Identifiable, Codable {
  let id = UUID()
  let imageUrl: String
  let title: String
  let date: String
  let href: String
  
  enum CodingKeys: String, CodingKey {
    case imageUrl
    case title
    case date
    case href
  }
}

struct WidgetData: Codable {
  var articles: [ArticleData]
}

struct ArticleView: View {
  let article: ArticleData
  
  let isoFormatter: ISO8601DateFormatter = {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return formatter
  }()
  
  var body: some View {
    Link(destination: URL(string: article.href)!) {
      HStack {
        if let url = URL(string: article.imageUrl), let imageData = try? Data(contentsOf: url), let uiImage = UIImage(data: imageData) {
          Image(uiImage: uiImage)
            .resizable()
            .aspectRatio(contentMode: .fill)
            .frame(width: 50, height: 50)
            .clipped()
            .clipShape(.rect(cornerSize: .init(width: 12, height: 12)))
        } else {
          Color.gray
            .frame(width: 50, height: 50)
        }
        VStack(alignment: .leading) {
          Text(article.title)
            .font(.headline)
            .lineLimit(2)
          
          if let date = isoFormatter.date(from: article.date) {
            Text(date, style: .date)
              .font(.caption)
              .foregroundColor(Color(.secondaryLabel))
          }
        }
      }
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

struct NewsWidgetEntryView: View {
  @Environment(\.widgetFamily) var family
  var entry: NewsProvider.Entry
  
  var body: some View {
    Group {
      if family == .systemMedium {
        mediumView
      } else if family == .systemSmall {
        smallView
      } else {
        largeView
      }
    }
    .containerBackground(for: .widget) {
      if family == .systemSmall {
        // Full-size background image
        if let article = entry.data.articles.first, let url = URL(string: article.imageUrl),
           let imageData = try? Data(contentsOf: url),
           let uiImage = UIImage(data: imageData) {
          Image(uiImage: uiImage)
            .resizable()
            .aspectRatio(contentMode: .fill)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .clipped()
        } else {
          Color(.systemBackground)
        }
      } else {
        Color(.systemBackground)
      }
    }
  }
  
  let isoFormatter: ISO8601DateFormatter = {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return formatter
  }()
  
  
  @ViewBuilder
  private var smallView: some View {
    if let article = entry.data.articles.first {
      ZStack {
        
        // Text overlay
        VStack(alignment: .leading) {
          Spacer()
          Text(article.title)
            .font(.headline)
            .foregroundColor(.white)
            .multilineTextAlignment(.leading)
            .shadow(color: .black.opacity(0.7), radius: 2, x: 0, y: 1)
            .padding(0)
          if let date = isoFormatter.date(from: article.date) {
            Text(date, style: .date)
              .font(.caption)
              .foregroundColor(.white)
              .multilineTextAlignment(.leading)
              .shadow(color: .black.opacity(0.7), radius: 2, x: 0, y: 1)
              .foregroundColor(Color(.secondaryLabel))
            
          }
        }
        
        // Logo overlay
        VStack {
          HStack {
            Spacer()
            Image(.logo)
              .renderingMode(.template)
              .resizable()
              .frame(width: 18, height: 18)
              .padding(4)
              .background(.white.opacity(0.5))
              .clipShape(.circle)
              .foregroundColor(.black)
          }
          Spacer()
        }
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      .widgetURL(URL(string: article.href)!)
      // Ensure ZStack fills the container
    }
  }
  
  @ViewBuilder
  private var mediumView: some View {
    ZStack {
      
      VStack(alignment: .leading, spacing: 8) {
        ForEach(entry.data.articles.prefix(2)) { article in
          ArticleView(article: article)
        }
      }
      VStack{
        HStack {
          Spacer()
          Image(.logo)
            .renderingMode(.template)
            .resizable()
            .frame(width: 18, height: 18)
            .padding(4)
            .background(.white.opacity(0.5))
            .clipShape(.circle)
            .foregroundColor(.black)
          
        }
        Spacer()
      }
      
    }
    
  }
  
  @ViewBuilder
  private var largeView: some View {
    VStack(alignment: .leading, spacing: 8) {
      ForEach(entry.data.articles.prefix(6)) { article in
        ArticleView(article: article)
      }
    }
    
  }
}

struct NewsProvider: TimelineProvider {
  func placeholder(in context: Context) -> NewsEntry {
    NewsEntry(date: Date(), data: defaultData())
  }
  
  func getSnapshot(in context: Context, completion: @escaping (NewsEntry) -> ()) {
    let entry = NewsEntry(date: Date(), data: loadDataFromSharedStore())
    completion(entry)
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<NewsEntry>) -> ()) {
    let data = loadDataFromSharedStore()
    let entry = NewsEntry(date: Date(), data: data)
    
    let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
    let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
    
    completion(timeline)
  }
  
  func loadDataFromSharedStore() -> WidgetData {
    let sharedDefaults = UserDefaults(suiteName: "group.bacon.data")
    
    var articlesArray: [ArticleData] = sampleArticles()
    if let articlesData = sharedDefaults?.data(forKey: "articlesData") {
      let decoder = JSONDecoder()
      let isoFormatter = ISO8601DateFormatter()
      isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
      
      decoder.dateDecodingStrategy = .custom { decoder in
        let container = try decoder.singleValueContainer()
        let dateString = try container.decode(String.self)
        if let date = isoFormatter.date(from: dateString) {
          return date
        }
        throw DecodingError.dataCorruptedError(in: container, debugDescription: "Invalid date format: \(dateString)")
      }
      
      do {
        let decodedArticles = try decoder.decode([ArticleData].self, from: articlesData)
        articlesArray = decodedArticles
      } catch {
        print("Failed to decode articles data: \(error)")
        if let jsonString = String(data: articlesData, encoding: .utf8) {
          print("Raw articlesData JSON: \(jsonString)")
        }
      }
    }
    
    return WidgetData(articles: articlesArray)
  }
  
  func defaultData() -> WidgetData {
    WidgetData(articles: sampleArticles())
  }
  
  func sampleArticles() -> [ArticleData] {
    return [
      ArticleData(imageUrl: "https://github.com/evanbacon.png", title: "Sample Article 1", date: "2024-12-10T05:18:58.102Z", href: "/blog"),
      ArticleData(imageUrl: "https://github.com/expo.png", title: "Sample Article 2", date: "2023-10-02", href: "/blog"),
      ArticleData(imageUrl: "https://github.com/evanbacon.png", title: "Sample Article 3", date: "2023-10-03", href: "/blog"),
      ArticleData(imageUrl: "https://github.com/expo.png", title: "Sample Article 4", date: "2023-10-04", href: "/blog")
    ]
  }
}

struct NewsEntry: TimelineEntry {
  let date: Date
  let data: WidgetData
}

@main
struct NewsWidget: Widget {
  let kind: String = "widget"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: NewsProvider()) { entry in
      NewsWidgetEntryView(entry: entry)
    }
    .supportedFamilies([.systemSmall, .systemMedium])
    .configurationDisplayName("Bacon Blog")
    .description("View the latest articles.")
  }
}

#if DEBUG
struct NewsWidgetEntryView_Previews: PreviewProvider {
  static var sampleData: WidgetData {
    WidgetData(articles: [
      ArticleData(imageUrl: "https://github.com/evanbacon.png", title: "Sample Article 1", date: "2024-12-10T05:18:58.102Z", href: "/blog"),
      ArticleData(imageUrl: "https://github.com/expo.png", title: "Sample Article 2", date: "2023-10-02", href: "/blog"),
      ArticleData(imageUrl: "https://github.com/evanbacon.png", title: "Sample Article 3", date: "2023-10-03", href: "/blog"),
      ArticleData(imageUrl: "https://github.com/expo.png", title: "Sample Article 4", date: "2023-10-04", href: "/blog")
    ])
  }
  
  static var entry: NewsEntry {
    NewsEntry(date: Date(), data: sampleData)
  }
  
  static var previews: some View {
    Group {
      NewsWidgetEntryView(entry: entry)
        .previewContext(WidgetPreviewContext(family: .systemSmall))
      
      NewsWidgetEntryView(entry: entry)
        .previewContext(WidgetPreviewContext(family: .systemMedium))
      
      //      NewsWidgetEntryView(entry: entry)
      //        .previewContext(WidgetPreviewContext(family: .systemLarge))
    }
  }
}
#endif
