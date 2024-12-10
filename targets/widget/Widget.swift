import WidgetKit
import SwiftUI


struct PortfolioData: Identifiable, Codable {
    let id = UUID()
    let timestamp: Date
    let value: Double

    // By not including `id` in CodingKeys, it won't be decoded from JSON
    enum CodingKeys: String, CodingKey {
        case timestamp
        case value
    }
}

struct WidgetData: Codable {
    var currentValue: Double
    var dailyChange: Double
    var dailyChangePercent: Double
    var history: [PortfolioData]
}


struct LineChart: View {
    let history: [PortfolioData]

    var body: some View {
        GeometryReader { geo in
            let points = history.map { $0.value }
            let minVal = points.min() ?? 0
            let maxVal = points.max() ?? 1
            let scale = maxVal - minVal == 0 ? 1 : maxVal - minVal

            ZStack {
                // Main line path
                Path { path in
                    guard let first = points.first else { return }
                    let xStep = geo.size.width / CGFloat(points.count - 1)
                    let yStart = geo.size.height - ((CGFloat(first) - CGFloat(minVal)) / CGFloat(scale) * geo.size.height)
                    path.move(to: CGPoint(x: 0, y: yStart))

                    for (index, value) in points.enumerated() {
                        let x = CGFloat(index) * xStep
                        let y = geo.size.height - ((CGFloat(value) - CGFloat(minVal)) / CGFloat(scale) * geo.size.height)
                        path.addLine(to: CGPoint(x: x, y: y))
                    }
                }
                .stroke(Color.green, lineWidth: 2)

                // Dashed line at the last point's value
                if let last = points.last {
                    Path { path in
                        let yLast = geo.size.height - ((CGFloat(last) - CGFloat(minVal)) / CGFloat(scale) * geo.size.height)
                        path.move(to: CGPoint(x: 0, y: yLast))
                        path.addLine(to: CGPoint(x: geo.size.width, y: yLast))
                    }
                    .stroke(style: StrokeStyle(lineWidth: 1, dash: [5, 3]))
                    .foregroundColor(.gray)
                }
            }
        }
    }
}

struct PortfolioWidgetEntryView: View {
    @Environment(\.widgetFamily) var family
    var entry: PortfolioProvider.Entry

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
        .containerBackground(for: .widget) { Color(.systemBackground) }
    }

    @ViewBuilder
    private var smallView: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                chartSection
                    .frame(height: chartHeight())
                Spacer()
                Image("logo")
                .renderingMode(.template)
                    .resizable()
                    .frame(width: logoSize(), height: logoSize())
                    .tint(Color(.label))
            }

            VStack(alignment: .leading, spacing: 4) {
                headerSection
                changeSection
                Spacer()
                timeSection
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    @ViewBuilder
    private var mediumView: some View {
        VStack(alignment: .center, spacing: 8) {
            HStack {
                Spacer()
                Image("logo")
                    .renderingMode(.template)
                    .resizable()
                    .frame(width: logoSize(), height: logoSize())
                    .tint(Color(.label))
            }

            HStack(alignment: .top, spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    headerSection
                    changeSection
                    Spacer()
                    timeSection
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                chartSection
                    .frame(maxWidth: .infinity)
            }
        }
    }

    @ViewBuilder
    private var largeView: some View {
        ZStack(alignment: .topTrailing) {
            VStack(alignment: .leading, spacing: verticalSpacing()) {
                if family == .systemLarge {
                    Text("Portfolio")
                        .font(.headline)
                }

                headerSection
                changeSection

                chartSection
                    .frame(height: chartHeight())

                if family == .systemLarge {
                    Text("Last updated: \(entry.date, style: .time)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                HStack {
                    Spacer()
                    timeSection
                }
            }
            .padding()

            Image("logo")
                .renderingMode(.template)
                .resizable()
                .frame(width: logoSize(), height: logoSize())
                .padding([.top, .trailing], 8)
                
                .tint(Color(.label))
        }
    }

    // MARK: - Helper Subviews

    private var headerSection: some View {
        HStack(alignment: .firstTextBaseline, spacing: 4) {
            Text(entry.data.currentValue.formatted(.currency(code: "USD")))
                .font(.system(size: mainValueFontSize(), weight: .bold))
                .alignmentGuide(.firstTextBaseline) { $0[.bottom] }
        }
    }

    private var changeSection: some View {
        let isPositive = entry.data.dailyChange >= 0
        let changeColor = isPositive ? Color.green : Color.red

        if family == .systemSmall {
            return AnyView(
                Text("\(entry.data.dailyChangePercent, format: .percent.precision(.fractionLength(2)))")
                    .font(.body)
                    .foregroundColor(changeColor)
            )
        } else {
            return AnyView(
                HStack(spacing: 2) {
                    Text(entry.data.dailyChange.formatted(.currency(code: "USD")))
                    Text("(\(entry.data.dailyChangePercent, format: .number.precision(.fractionLength(2)))%)")
                }
                .font(.caption)
                .foregroundColor(changeColor)
            )
        }
    }

    private var chartSection: some View {
        LineChart(history: entry.data.history)
    }

    private var timeSection: some View {
        Text(relativeTimeString(since: entry.date))
            .font(.caption2)
            .foregroundColor(.gray)
    }

    // MARK: - Sizing & Styling Helpers

    private func mainValueFontSize() -> CGFloat {
        switch family {
        case .systemSmall: return 24
        case .systemMedium: return 20
        case .systemLarge: return 24
        default: return 16
        }
    }

    private func logoSize() -> CGFloat {
        switch family {
        case .systemSmall: return 24
        case .systemMedium: return 24
        case .systemLarge: return 36
        default: return 20
        }
    }

    private func chartHeight() -> CGFloat {
        switch family {
        case .systemSmall: return 24
        case .systemMedium: return 60
        case .systemLarge: return 80
        default: return 50
        }
    }

    private func verticalSpacing() -> CGFloat {
        switch family {
        case .systemLarge: return 6
        default: return 4
        }
    }

    private func relativeTimeString(since date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .short
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

struct PortfolioProvider: TimelineProvider {
    func placeholder(in context: Context) -> PortfolioEntry {
        PortfolioEntry(date: Date(), data: defaultData())
    }

    func getSnapshot(in context: Context, completion: @escaping (PortfolioEntry) -> ()) {
        let entry = PortfolioEntry(date: Date(), data: loadDataFromSharedStore())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PortfolioEntry>) -> ()) {
        let data = loadDataFromSharedStore()
        let entry = PortfolioEntry(date: Date(), data: data)

        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))

        completion(timeline)
    }

    func loadDataFromSharedStore() -> WidgetData {
        let sharedDefaults = UserDefaults(suiteName: "group.bacon.data")

        let currentValue = sharedDefaults?.double(forKey: "currentValue") ?? 21815.99
        let dailyChange = sharedDefaults?.double(forKey: "dailyChange") ?? 245.85
        let dailyChangePercent = sharedDefaults?.double(forKey: "dailyChangePercent") ?? 1.14

        var historyArray: [PortfolioData] = sampleHistory()
        if let historyData = sharedDefaults?.data(forKey: "historyData") {
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
                let decodedHistory = try decoder.decode([PortfolioData].self, from: historyData)
                historyArray = decodedHistory
            } catch {
                print("Failed to decode history data: \(error)")
                if let jsonString = String(data: historyData, encoding: .utf8) {
                    print("Raw historyData JSON: \(jsonString)")
                }
            }
        }

        return WidgetData(
            currentValue: currentValue,
            dailyChange: dailyChange,
            dailyChangePercent: dailyChangePercent,
            history: historyArray
        )
    }

    func defaultData() -> WidgetData {
        WidgetData(
            currentValue: 21815.99,
            dailyChange: 245.85,
            dailyChangePercent: 1.14,
            history: sampleHistory()
        )
    }

    func sampleHistory() -> [PortfolioData] {
        var data: [PortfolioData] = []
        let baseTime = Date().addingTimeInterval(-3600 * 24)
        for i in 0..<20 {
            let value = 20000 + Double(i) * 10 + Double.random(in: -50...50)
            data.append(PortfolioData(timestamp: baseTime.addingTimeInterval(Double(i)*3600), value: value))
        }
        return data
    }
}

struct PortfolioEntry: TimelineEntry {
    let date: Date
    let data: WidgetData
}

@main
struct PortfolioWidget: Widget {
    let kind: String = "PortfolioWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PortfolioProvider()) { entry in
            PortfolioWidgetEntryView(entry: entry)
        }
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
        .configurationDisplayName("Portfolio")
        .description("View your portfolio value and daily changes.")
    }
}

#if DEBUG
struct PortfolioWidgetEntryView_Previews: PreviewProvider {
    static var sampleData: WidgetData {
        WidgetData(
            currentValue: 21815.99,
            dailyChange: 245.85,
            dailyChangePercent: 1.14,
            history: {
                var data: [PortfolioData] = []
                let baseTime = Date().addingTimeInterval(-3600 * 24)
                for i in 0..<20 {
                    let value = 20000 + Double(i) * 10 + Double.random(in: -50...50)
                    data.append(PortfolioData(timestamp: baseTime.addingTimeInterval(Double(i)*3600), value: value))
                }
                return data
            }()
        )
    }

    static var entry: PortfolioEntry {
        PortfolioEntry(date: Date(), data: sampleData)
    }

    static var previews: some View {
        Group {
            PortfolioWidgetEntryView(entry: entry)
                .previewContext(WidgetPreviewContext(family: .systemSmall))

            PortfolioWidgetEntryView(entry: entry)
                .previewContext(WidgetPreviewContext(family: .systemMedium))

            PortfolioWidgetEntryView(entry: entry)
                .previewContext(WidgetPreviewContext(family: .systemLarge))
        }
    }
}
#endif
